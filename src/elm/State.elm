module State exposing(..)

import Types exposing (..)

initialState : View -> (Model, Cmd Msg)
initialState initialView =
  ( {
    view = initialView
  }, Cmd.none)

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    NoOp ->
      (model, Cmd.none)

urlUpdate : View -> Model -> (Model, Cmd Msg)
urlUpdate view model =
  ( { model | view = view }, Cmd.none)
