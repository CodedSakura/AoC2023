getFirstDigit :: [Char] -> Char
getFirstDigit [] = '0'
getFirstDigit s
    | (head s) <= '9'       = (head s)
    | isPrefixOf "one" s    = '1'
    | isPrefixOf "two" s    = '2'
    | isPrefixOf "three" s  = '3'
    | isPrefixOf "four" s   = '4'
    | isPrefixOf "five" s   = '5'
    | isPrefixOf "six" s    = '6'
    | isPrefixOf "seven" s  = '7'
    | isPrefixOf "eight" s  = '8'
    | isPrefixOf "nine" s   = '9'
    | isPrefixOf "eno" s    = '1'
    | isPrefixOf "owt" s    = '2'
    | isPrefixOf "eerht" s  = '3'
    | isPrefixOf "ruof" s   = '4'
    | isPrefixOf "evif" s   = '5'
    | isPrefixOf "xis" s    = '6'
    | isPrefixOf "neves" s  = '7'
    | isPrefixOf "thgie" s  = '8'
    | isPrefixOf "enin" s   = '9'
    | otherwise             = getFirstDigit (tail s)

getLastDigit :: [Char] -> Char
getLastDigit s = getFirstDigit (reverse s)

getFirstLastDigits :: [Char] -> [Char]
getFirstLastDigits s = [getFirstDigit s] ++ [getLastDigit s]

isPrefixOf :: (Eq a) => [a] -> [a] -> Bool
isPrefixOf [] _ = True
isPrefixOf _ [] = False
isPrefixOf (n:needle) (h:haystack)
    | n == h    = isPrefixOf needle haystack
    | otherwise = False

tailN :: Int -> [a] -> [a]
tailN _ [] = []
tailN 0 s = s
tailN n (s:xs) = tailN (n-1) xs

main = do
    contents <- fmap lines $ readFile "input.txt"
    let numberStrings = map getFirstLastDigits contents
    let numbers = map read numberStrings :: [Int]
    print $ sum numbers
