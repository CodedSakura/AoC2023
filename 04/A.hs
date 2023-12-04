import Data.List.Split
import Data.List

tuplify2 :: [a] -> (a,a)
tuplify2 [x,y] = (x,y)

parseLine :: String -> ([Int], [Int])
parseLine s = 
    tuplify2 (map (\ss -> map (\n -> read n :: Int) (filter (\n -> length n > 0) (splitOn " " ss))) (splitOn " | " ((splitOn ": " s) !! 1)))

main = do
    contents <- fmap lines $ readFile "input.txt"
    print $ sum (map (\(a,b) -> 2 ^ (length (a `intersect` b)) `div` 2) (map parseLine contents))
