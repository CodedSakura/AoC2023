import Data.List.Split
import Data.List

tuplify2 :: [a] -> (a,a)
tuplify2 [x,y] = (x,y)

parseLine :: String -> ([Int], [Int])
parseLine s = 
    tuplify2 (map (\ss -> map (\n -> read n :: Int) (filter (\n -> length n > 0) (splitOn " " ss))) (splitOn " | " ((splitOn ": " s) !! 1)))

listSum :: [Int] -> [Int] -> [Int]
listSum s [] = s
listSum [] s = s
listSum (a:xa) (b:xb) = [a+b] ++ listSum xa xb

oneList :: [Int] -> [Int]
oneList [] = []
oneList (_:xs) = [1] ++ oneList xs

makeWinningsList :: Int -> Int -> [Int]
makeWinningsList _ 0 = []
makeWinningsList n 1 = [n]
makeWinningsList n s = [n] ++ makeWinningsList n (s-1)

calculateWinnings :: [Int] -> [Int] -> [Int]
calculateWinnings [] _ = []
calculateWinnings _ [] = []
calculateWinnings (x:xs) (c:cs) = 
    [c] ++ calculateWinnings xs (listSum (makeWinningsList c x) cs)

main = do
    contents <- fmap lines $ readFile "input.txt"
    let winnings = (map (\(a,b) -> (length (a `intersect` b))) (map parseLine contents))
    print $ sum (calculateWinnings winnings (oneList winnings))
