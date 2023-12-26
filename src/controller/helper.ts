import generateUniqueId from "generate-unique-id";


export const genUniqueIdFunc = () => {
    return generateUniqueId({
        length: 15,
        useLetters: true,
        useNumbers: true,
        includeSymbols: ['_', '|']
    })
}