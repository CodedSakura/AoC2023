import Data.List.Split
import Data.List

checkReflection s = 
    let ref = [a | (a, r) <- zip [0..] s, a + 1 < length s, r == s !! (a + 1)]
    in 
        if length ref > 0 then
            head ([start + 1 | 
                            (start, len) <- [(up, (min up down)) | up <- ref, let down = (length s) - up - 2],
                            length [(up, dn) | dn <- [start+1..start+len+1], let up = start - (dn - start) + 1, (s !! up) == (s !! dn)] == len + 1] ++ [-1])
        else -1

main = do
    contents <- fmap lines $ readFile "input.txt"
    -- print $ map checkReflection $ splitOn [""] contents
    -- print $ map (checkReflection . transpose) $ splitOn [""] contents
    let horizontal = sum $ filter (/= -1) $ map checkReflection $ splitOn [""] contents
    let vertical = sum $ filter (/= -1) $ map (checkReflection . transpose) $ splitOn [""] contents
    print $ horizontal * 100 + vertical
