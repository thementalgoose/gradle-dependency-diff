export function space(indentation: number): string { 
    let str = "";
    for (let i = 0; i < indentation; i++) { 
        str += " ";
    }
    return str;
}