import Data.List.Split

parseLine :: [Char] -> [Int]
parseLine s = map read $ splitOn " " s

diff :: [Int] -> [Int]
diff [] = []
diff [_] = []
diff (x:xs) = [head xs - x] ++ diff xs

allZeros :: [Int] -> Bool
allZeros [] = True
allZeros (0:xs) = allZeros xs
allZeros _ = False

diffUntilZero :: [Int] -> [[Int]]
diffUntilZero l
    | allZeros l = [l]
    | otherwise  = [l] ++ diffUntilZero (diff l)

extrapolate :: [[Int]] -> Int
extrapolate [] = 0
extrapolate ((s:_):xs) = s - extrapolate xs

analyze s = extrapolate $ diffUntilZero $ parseLine s

main = do
    contents <- fmap lines $ readFile "input.txt"
    print $ sum $ map analyze contents
