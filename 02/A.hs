import Text.Regex.TDFA
import Text.Regex.TDFA.Text ()

getGameID :: String -> Int
getGameID s = read (s =~ "[0-9]+") :: Int

get4th (_,_,_,a) = a

getRegexGroups :: String -> String -> [String]
getRegexGroups s r =
    get4th (s =~ r :: (String, String, String, [String]))

getGameGroups :: String -> [String]
getGameGroups s = getAllTextMatches (s =~ "[0-9][0-9 a-z,]+")

getGameCubeCounts :: String -> (Int, Int, Int)
getGameCubeCounts s = 
    let r = read (head (getRegexGroups s "([0-9]+) red" ++ ["0"])) :: Int
        g = read (head (getRegexGroups s "([0-9]+) green" ++ ["0"])) :: Int
        b = read (head (getRegexGroups s "([0-9]+) blue" ++ ["0"])) :: Int
    in (r, g, b)

parseGame :: String -> (Int, [(Int, Int, Int)])
parseGame s =
    let gameId = getGameID s
        cubeCounts = map getGameCubeCounts (getGameGroups s)
    in (gameId, cubeCounts)

validateGame :: [(Int, Int, Int)] -> Bool
validateGame [] = True
validateGame ((r,g,b):v) =
    validateGame v && (r <= 12 && g <= 13 && b <= 14)

getIdIfValidGame :: String -> Int
getIdIfValidGame s =
    let gameId = getGameID s
        cubeCounts = map getGameCubeCounts (getGameGroups s)
        isValid = validateGame cubeCounts
    in case isValid of 
        True -> gameId
        otherwise -> 0
    

main = do
    contents <- fmap lines $ readFile "input.txt"
    let ids = map getIdIfValidGame contents
    print $ sum ids
