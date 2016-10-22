module View exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)

import Routing exposing (Router)
import Types exposing (..)
import Components.LoremIpsum as LoremIpsum

type ListItem
  = Divider
  | Header String
  | Link String String
  | Text String

rootView : Router View -> Model -> Html Msg
rootView router model =
  div [] [
    renderNavigation model,
    renderMainContent model,
    renderFooter model
  ]


renderListItem : ListItem -> Html Msg
renderListItem item =
  case item of
    Divider ->
      li [ class "divider", attribute "role" "separator" ] []
    Header name ->
      li [ class "dropdown-header" ] [ text name ]
    Link link name ->
      li [] [ a [ href link ] [ text name ] ]
    Text content ->
      li [] [ text content ]

renderDropdownList : String -> List ListItem -> Html Msg
renderDropdownList title items =
  li [ class "dropdown" ] [
    a [ attribute "aria-expanded" "false", attribute "aria-haspopup" "true", class "dropdown-toggle", attribute "data-toggle" "dropdown", href "#", attribute "role" "button" ] [
      text title,
      span [ class "caret" ] []
    ],
    ul [ class "dropdown-menu" ]
      (List.map renderListItem items)
  ]

renderNavigation : Model -> Html Msg
renderNavigation model =
  nav [ class "navbar navbar-default navbar-fixed-top" ] [
    div [ class "container-fluid" ] [
      div [ class "navbar-header" ] [
        button [
          attribute "aria-expanded" "false",
          class "navbar-toggle collapsed",
          attribute "data-target" "#navigation-collapse",
          attribute "data-toggle" "collapse",
          type' "button"
          ] [
            span [ class "sr-only" ] [ text "Toggle navigation" ],
            span [ class "icon-bar" ] [],
            span [ class "icon-bar" ] [],
            span [ class "icon-bar" ] []
          ],
          a [ class "navbar-brand", href "#" ] [ text "Navbar Brand" ]
      ],
      div [ id "navigation-collapse", class "collapse navbar-collapse" ] [
        ul [ class "nav navbar-nav" ] [
          renderDropdownList "Dropdown 1" [
            Header "Header 1",
            Link "#" "Link 1",
            Link "#" "Link 2",
            Link "#" "Link 3",
            Divider,
            Header "Header 2",
            Link "#" "Link 1"
            ],
          renderListItem (Link "#" "Link"),
          renderDropdownList "Dropdown 2" [
            Header "Header 1",
            Link "#" "Link 1",
            Link "#" "Link 2",
            Link "#" "Link 3",
            Divider,
            Header "Header 2",
            Link "#" "Link 1"
            ]
        ],
        ul [ class "nav navbar-nav navbar-right" ] [
          renderListItem (Link "#" "Rightside Link")
        ]
      ]
    ]
  ]


renderMainContent : Model -> Html Msg
renderMainContent model =
  div [ class "container-fluid" ] [
    div [ class "jumbotron" ] [
      h1 [ class "text-center" ] [ text "Jumbotron" ],
      LoremIpsum.paragraphs 1
    ],
    div [ class "container-fluid" ] (List.repeat 3 renderRow)
  ]

renderRow : Html Msg
renderRow =
  div [ class "row" ] (List.repeat 3 renderColumn)


renderColumn : Html Msg
renderColumn =
  div [ class "col-xs-12 col-md-6 col-lg-4" ] [
    h1 [ class "text-center" ] [ text "Column" ],
    LoremIpsum.paragraphs 3
  ]


renderFooter : Model -> Html Msg
renderFooter model =
  footer [ class "footer-sticky-bottom" ] [
    p [ class "text-muted text-center" ] [ text "footer p" ]
  ]
