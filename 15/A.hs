import Data.Char
import Data.List
import Data.List.Split

hash s = hash' s 0
    where
        hash' "" n = n
        hash' (s:xs) n = hash' xs ((n + ord s) * 17 `mod` 256)

main = do
    contents <- readFile "input.txt"
    -- print $ hash "HASH"
    print $ sum $ map hash $ splitOn "," contents