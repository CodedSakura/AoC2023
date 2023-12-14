import Data.List

customCompare a b
    | a == '#' || b == '#'  = EQ
    | b == 'O'              = GT
    | otherwise             = EQ

bubbleSort :: [Char] -> [Char]
bubbleSort = foldr swapTill []
    where
        swapTill x [] = [x]
        swapTill x (y:xs)
            | customCompare x y == GT   = y : swapTill x xs
            | otherwise                 = x : swapTill y xs

rollRocksWest s = map bubbleSort s
rollRocksNorth s = transpose $ rollRocksWest $ transpose s
rollRocksEast s = map reverse $ rollRocksWest $ map reverse s
rollRocksSouth s = transpose $ map reverse $ rollRocksWest $ map reverse $ transpose s

cycleRocks s = rollRocksEast $ rollRocksSouth $ rollRocksWest $ rollRocksNorth s

cycleRocksN s n = cycleRocksN' s [] n
    where
        cycleRocksN' s ps n
            | n == 0    = s
            -- | s == ps   = s
            | otherwise = cycleRocksN' (cycleRocks s) s (n-1)

calcLoad s = map (\(c, l) -> c * (length $ filter (=='O') l)) (zip [1..] (reverse s))

main = do
    contents <- fmap lines $ readFile "test.txt"
    putStrLn $ intercalate "\n" $ cycleRocksN contents 1000000
    -- print $ sum $ calcLoad $  contents