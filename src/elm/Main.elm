import Html exposing (..)
import Html.Attributes exposing (..)
import Html.App as App
import Html.Events exposing ( onClick )

import Components.Hello exposing ( hello )


main : Program Never
main =
  App.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }



type alias Model =
  {
    counter : Int
  }

initialModel : Model
initialModel =
  {
    counter = 0
  }


init : (Model, Cmd Msg)
init =
  (initialModel, Cmd.none)

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none


type Msg
  = NoOp
  | Increment

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    NoOp -> (model, Cmd.none)
    Increment -> ({model | counter = model.counter + 1}, Cmd.none)


view : Model -> Html Msg
view model =
  div [ class "container-fluid", style [("margin-top", "30px"), ( "text-align", "center" )] ][
    div [ class "row" ][
      div [ class "col-xs-12" ][
        div [ class "jumbotron" ][
          img [ src "static/img/elm.jpg", style styles.img ] []
          , hello model.counter
          , p [] [ text ( "Elm Webpack Starter" ) ]
          , button [ class "btn btn-primary btn-lg", onClick Increment ] [
            span[ class "glyphicon glyphicon-star" ][]
            , span[][ text "FTW!" ]
          ]
        ]
      ]
    ]
  ]


styles : { img : List ( String, String ) }
styles =
  {
    img =
      [ ( "width", "33%" )
      , ( "border", "4px solid #337AB7")
      ]
  }
