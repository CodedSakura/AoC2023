import Data.Char
import Data.List
import Data.List.Split
import Data.Maybe
import Debug.Trace

hash s = hash' s 0
    where
        hash' "" n = n
        hash' (s:xs) n = hash' xs ((n + ord s) * 17 `mod` 256)

parseInstruction s
    | last s == '-' = (init s, -1)
    | otherwise     =
        let [v, n] = splitOn "=" s
        in (v, read n)

performInstructions s = performInstructions' s [[] | _ <- [0..255]]
    where
        performInstructions' [] b = b
        performInstructions' ((l, o):xs) b
            | o == -1   = performInstructions' xs (removeLens b l)
            | otherwise = performInstructions' xs (setLens b l o)

        removeLens b l =
            let box = hash l
            in take box b ++ [removeLensFromBox (b !! box) l] ++ drop (box + 1) b

        removeLensFromBox box l = filter (\(b, _) -> b /= l) box

        setLens b l o =
            let box = hash l
                inBox = length (filter (\(a, _) -> a == l) (b !! box)) > 0
            in take box b ++ [
                if inBox then
                    let inBoxIndex = fromMaybe (-1) $ elemIndex (head $ filter (\(a, _) -> a == l) (b !! box)) (b !! box)
                    in take inBoxIndex (b !! box) ++ [(l, o)] ++ drop (inBoxIndex + 1) (b !! box)
                else 
                    (b !! box)++[(l, o)]
            ] ++ drop (box + 1) b



focusingPower s = [n * s * v | (n, l) <- zip [1..] s, length l > 0, (s, (_, v)) <- zip [1..] l]

main = do
    contents <- readFile "input.txt"
    -- print $ hash "HASH"
    print $ sum $ focusingPower $ performInstructions $ map parseInstruction $ splitOn "," contents