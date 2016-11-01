module Types exposing (..)

type Msg
  = NoOp

type View
  = FrontPage
  | NotFound

type alias Model = {
  view : View
}


