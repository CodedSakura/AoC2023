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

rollRocks s = bubbleSort s

calcLoad s = map (\(c, l) -> c * (length $ filter (=='O') l)) (zip [1..] (reverse s))

main = do
    contents <- fmap lines $ readFile "input.txt"
    -- putStrLn $ intercalate "\n" $ transpose $ map rollRocks $ transpose contents
    print $ sum $ calcLoad $ transpose $ map rollRocks $ transpose contents