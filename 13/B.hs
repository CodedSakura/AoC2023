import Data.List.Split
import Data.List

similar [] [] = True
similar a b = similar' a b 0
    where 
        similar' _ _ 2 = False
        similar' [] [] _ = True
        similar' (a:xa) (b:xb) n
            | a /= b    = similar' xa xb (n+1)
            | otherwise = similar' xa xb n

checkReflection s = 
    let ref = [a | (a, r) <- zip [0..] s, a + 1 < length s, r `similar` (s !! (a + 1))]
    in 
        if length ref > 0 then
            head ([start + 1 | 
                            (start, len) <- [(up, (min up down)) | up <- ref, let down = (length s) - up - 2],
                            let n = [(up, dn) | dn <- [start+1..start+len+1], let up = start - (dn - start) + 1, (s !! up) `similar` (s !! dn)],
                            length n == len + 1,
                            length n == length (filter (\(up, dn) -> (s !! up) == (s !! dn)) n) + 1
                ] ++ [-1])
        else -1

main = do
    contents <- fmap lines $ readFile "input.txt"
    -- print $ map checkReflection $ splitOn [""] contents
    -- print $ map (checkReflection . transpose) $ splitOn [""] contents
    let horizontal = sum $ filter (/= -1) $ map checkReflection $ splitOn [""] contents
    let vertical = sum $ filter (/= -1) $ map (checkReflection . transpose) $ splitOn [""] contents
    print $ horizontal * 100 + vertical
