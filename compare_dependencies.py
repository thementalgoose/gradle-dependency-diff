#!/usr/bin/env python3
"""
Gradle Dependency Comparison Tool

This script compares two Gradle dependency outputs from the command:
./gradlew :app:dependencies --configuration productionReleaseRuntimeClasspath

It analyzes the differences and provides a summary of:
- Additions: Dependencies added in the second output
- Deletions: Dependencies removed from the first output  
- Changes: Dependencies with different versions, showing full paths

Usage:
    python gradle_dep_compare.py file1.txt file2.txt
"""

import re
import sys
from typing import Dict, List, Set, Tuple, Optional
from dataclasses import dataclass
from collections import defaultdict

@dataclass
class Dependency:
    """Represents a dependency with its group, artifact, version and path"""
    group: str
    artifact: str
    version: str
    full_name: str
    path: List[str]
    line: str
    
    def __post_init__(self):
        self.full_name = f"{self.group}:{self.artifact}:{self.version}"

class GradleDependencyParser:
    """Parser for Gradle dependency tree output"""
    
    def __init__(self):
        # Regex patterns for parsing dependency lines
        self.dep_pattern = re.compile(r'([+\\|`\s\-]*)\s*([^:\s]+):([^:\s]+):([^\s]+)(\s*\([*cn]\))?')
        self.tree_symbols = re.compile(r'^([+\\|`\s\-]*)')
        
    def parse_dependency_output(self, content: str) -> Dict[str, List[Dependency]]:
        """
        Parse gradle dependency output into structured data
        
        Returns:
            Dictionary mapping dependency keys to list of Dependency objects
        """
        lines = content.strip().split('\n')
        dependencies = {}
        path_stack = []
        
        for line_num, line in enumerate(lines, 1):
            # Skip empty lines and headers
            if not line.strip() or '---' in line or 'Project' in line or 'configuration' in line.lower():
                continue
                
            # Parse dependency from line
            dep = self._parse_dependency_line(line, path_stack)
            if dep:
                # Use group:artifact as the key for comparison
                key = f"{dep.group}:{dep.artifact}"
                if key not in dependencies:
                    dependencies[key] = []
                dependencies[key].append(dep)
                
        return dependencies
    
    def _parse_dependency_line(self, line: str, path_stack: List[str]) -> Optional[Dependency]:
        """Parse a single dependency line and update the path stack"""
        
        # Extract tree structure symbols
        tree_match = self.tree_symbols.match(line)
        if not tree_match:
            return None
            
        tree_prefix = tree_match.group(1)
        
        # Calculate current depth based on tree symbols
        depth = self._calculate_depth(tree_prefix)
        
        # Match dependency pattern
        dep_match = self.dep_pattern.search(line)
        if not dep_match:
            return None
            
        group = dep_match.group(2)
        artifact = dep_match.group(3) 
        version = dep_match.group(4)
        
        # Skip certain annotations
        annotation = dep_match.group(5)
        if annotation and ('(*)' in annotation or '(c)' in annotation):
            return None
            
        # Update path stack based on depth
        if depth < len(path_stack):
            path_stack = path_stack[:depth]
        
        current_dep = f"{group}:{artifact}:{version}"
        path = path_stack.copy()
        path_stack.append(current_dep)
        
        return Dependency(
            group=group,
            artifact=artifact, 
            version=version,
            full_name=current_dep,
            path=path,
            line=line.strip()
        )
    
    def _calculate_depth(self, tree_prefix: str) -> int:
        """Calculate the depth of a dependency based on tree symbols"""
        # Count the depth based on tree structure symbols
        # Each level typically adds 4-5 characters of indentation
        clean_prefix = tree_prefix.replace(' ', '').replace('|', '').replace('-', '').replace('+', '').replace('\\', '').replace('`', '')
        
        # Simple heuristic: count major tree symbols
        depth = 0
        for char in tree_prefix:
            if char in ['+', '\\']:
                depth += 1
                
        return depth

class DependencyComparator:
    """Compares two sets of parsed dependencies"""
    
    def __init__(self):
        pass
    
    def compare_dependencies(self, deps1: Dict[str, List[Dependency]], 
                           deps2: Dict[str, List[Dependency]]) -> Dict[str, any]:
        """
        Compare two dependency sets and return analysis
        
        Returns:
            Dictionary with 'additions', 'deletions', and 'changes' keys
        """
        
        keys1 = set(deps1.keys())
        keys2 = set(deps2.keys())
        
        # Find additions and deletions
        additions = keys2 - keys1
        deletions = keys1 - keys2
        common_keys = keys1 & keys2
        
        # Find changes in common dependencies
        changes = []
        for key in common_keys:
            versions1 = {dep.version for dep in deps1[key]}
            versions2 = {dep.version for dep in deps2[key]}
            
            if versions1 != versions2:
                changes.append({
                    'key': key,
                    'old_versions': versions1,
                    'new_versions': versions2,
                    'old_deps': deps1[key],
                    'new_deps': deps2[key]
                })
        
        return {
            'additions': [(key, deps2[key]) for key in additions],
            'deletions': [(key, deps1[key]) for key in deletions],
            'changes': changes
        }

def format_dependency_path(path: List[str], current_dep: str) -> str:
    """Format the full dependency path for display"""
    if not path:
        return f"└── {current_dep} (direct dependency)"
    
    full_path = " → ".join(path + [current_dep])
    return f"└── {full_path}"

def print_comparison_report(comparison: Dict[str, any]):
    """Print a formatted comparison report"""
    
    print("=" * 80)
    print("GRADLE DEPENDENCY COMPARISON REPORT")
    print("=" * 80)
    print()
    
    # Summary
    print("📊 SUMMARY:")
    print(f"  • Additions: {len(comparison['additions'])}")
    print(f"  • Deletions: {len(comparison['deletions'])}")
    print(f"  • Changes: {len(comparison['changes'])}")
    print()
    
    # Additions
    if comparison['additions']:
        print("➕ ADDITIONS:")
        print("-" * 40)
        for key, deps in comparison['additions']:
            print(f"\n📦 {key}")
            for dep in deps:
                path_str = format_dependency_path(dep.path, dep.full_name)
                print(f"   {path_str}")
        print()
    
    # Deletions  
    if comparison['deletions']:
        print("➖ DELETIONS:")
        print("-" * 40)
        for key, deps in comparison['deletions']:
            print(f"\n📦 {key}")
            for dep in deps:
                path_str = format_dependency_path(dep.path, dep.full_name)
                print(f"   {path_str}")
        print()
    
    # Changes (most important section)
    if comparison['changes']:
        print("🔄 CHANGES:")
        print("-" * 40)
        for change in comparison['changes']:
            print(f"\n📦 {change['key']}")
            print(f"   Old versions: {', '.join(sorted(change['old_versions']))}")
            print(f"   New versions: {', '.join(sorted(change['new_versions']))}")
            
            print("   Paths in OLD output:")
            for dep in change['old_deps']:
                path_str = format_dependency_path(dep.path, dep.full_name)
                print(f"     {path_str}")
                
            print("   Paths in NEW output:")
            for dep in change['new_deps']:
                path_str = format_dependency_path(dep.path, dep.full_name)
                print(f"     {path_str}")
        print()
    
    if not any([comparison['additions'], comparison['deletions'], comparison['changes']]):
        print("✅ No differences found between the two dependency outputs!")

def main():
    """Main function to run the comparison"""
    
    if len(sys.argv) != 3:
        print("Usage: python gradle_dep_compare.py <file1.txt> <file2.txt>")
        print()
        print("Where file1.txt and file2.txt contain the output from:")
        print("./gradlew :app:dependencies --configuration productionReleaseRuntimeClasspath")
        sys.exit(1)
    
    file1_path = sys.argv[1]
    file2_path = sys.argv[2]
    
    try:
        # Read the dependency outputs
        with open(file1_path, 'r', encoding='utf-8') as f:
            content1 = f.read()
            
        with open(file2_path, 'r', encoding='utf-8') as f:
            content2 = f.read()
            
        # Parse dependencies
        parser = GradleDependencyParser()
        print("Parsing first dependency output...")
        deps1 = parser.parse_dependency_output(content1)
        print(f"Found {len(deps1)} unique dependencies in first output")
        
        print("Parsing second dependency output...")
        deps2 = parser.parse_dependency_output(content2)
        print(f"Found {len(deps2)} unique dependencies in second output")
        print()
        
        # Compare dependencies
        comparator = DependencyComparator()
        comparison = comparator.compare_dependencies(deps1, deps2)
        
        # Print report
        print_comparison_report(comparison)
        
    except FileNotFoundError as e:
        print(f"Error: Could not find file {e.filename}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()