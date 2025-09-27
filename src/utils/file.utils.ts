import * as fs from 'fs'

export const readFile: (filename: string) => string[] = (filename: string) => {
  console.log(`Reading file ${filename}`)
  let text = fs.readFileSync(filename)
  return text.toString().split('\n')
}

export const writeFile: (filename: string, json: string) => boolean = (
  filename: string,
  json: string
) => {
  try {
    console.log(`Writing file ${filename}`)
    fs.writeFileSync(filename, json)
    return true
  } catch (e) {
    console.error(`Error writing file to ${filename} - ${e}`)
    return false
  }
}
