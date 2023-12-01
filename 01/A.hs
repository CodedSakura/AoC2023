getFirstDigit :: [Char] -> Char
getFirstDigit (c:s)
    | c <= '9'  = c
    | otherwise = getFirstDigit s

getLastDigit :: [Char] -> Char
getLastDigit s = getFirstDigit (reverse s)


getFirstLastDigits :: [Char] -> [Char]
getFirstLastDigits s = [getFirstDigit s] ++ [getLastDigit s]

main = do
    contents <- fmap lines $ readFile "input.txt"
    let numberStrings = map getFirstLastDigits contents
    let numbers = map read numberStrings :: [Int]
    print $ sum numbers
