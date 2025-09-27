import * as fs from 'fs'

export const readFile: (filename: string) => string[] = (filename: string) => {
  let text = fs.readFileSync(filename)
  return text.toString().split('\n')
}
