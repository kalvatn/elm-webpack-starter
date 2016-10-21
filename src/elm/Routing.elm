module Routing exposing (hashParser, hashRouter, parser, toPath, toUri, Router)

import String exposing (split, join, dropLeft, length, startsWith)
import Types exposing (View(..))
import UrlParser exposing (..)

type alias Router view =
  view -> String

removePrefix : String -> String -> String
removePrefix prefix s =
  if (startsWith prefix s) then
    dropLeft (length prefix) s
  else
    s

(<<=) : a -> Parser a b -> Parser (b -> c) c
(<<=) =
  UrlParser.format


hashRouter : Router View
hashRouter =
  toPath >> join "/" >> (++) "#/"


hashParser : String -> View
hashParser hash =
  hash
    |> removePrefix "#/"
    |> UrlParser.parse identity parser
    |> Result.withDefault NotFound


parser : Parser (View -> a) a
parser =
  oneOf
    [
      FrontPage <<= s "",
      FrontPage <<= s "#"
    ]

toPath : Types.View -> List String
toPath view =
  case view of
    FrontPage ->
      [ "" ]
    NotFound ->
      [ "404" ]


toUri : View -> String
toUri view =
  case (toPath view |> String.join "/") of
    "" ->
      ""
    str ->
      "#/" ++ str
