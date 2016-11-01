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
  | IconLink String String
  | ExternalLink String String
  | ExternalIconLink String String
  | Text String

rootView : Router View -> Model -> Html Msg
rootView router model =
  div [ class "parallax background-metal"] [
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
    IconLink link iconClass ->
      li [] [ a [ href link ] [ i [ class iconClass, attribute "aria-hidden" "true" ] [ ] ] ]
    ExternalLink link name ->
      li [] [ a [ target "_blank", href link ] [ text name ] ]
    ExternalIconLink link iconClass ->
      li [] [ a [ target "_blank", href link ] [ i [ class iconClass, attribute "aria-hidden" "true" ] [ ] ] ]
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
  nav [ id "site-navigation", class "navbar navbar-default navbar-fixed-top" ] [
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
  div [ id "site-content", class "container-fluid" ] [
    div [ class "jumbotron" ] [
      h1 [ class "text-center" ] [ text "Jumbotron" ],
      img [ src "static/img/metal.jpg", width 100, height 100 ] [],
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
  footer [ id "site-footer" ] [
    div [ class "container" ] [
      div [ class "row" ] [
        div [ id "footer-content", class "col-xs-12 col-md-12 col-lg-12" ] [
            ul [ id "footer-social", class "list-inline" ] [
              renderListItem(ExternalIconLink "mailto:mail.lol@lol.com" "fa fa-envelope-o fa-2x"),
              renderListItem(ExternalIconLink "https://www.google.no/maps/place/Nidaros+Cathedral/@63.4323752,10.3936631,13.75z/data=!4m5!3m4!1s0x0:0xb965bfe4f7eb71fd!8m2!3d63.4269058!4d10.3969288?hl=en" "fa fa-map-marker fa-2x"),
              renderListItem(ExternalIconLink "https://www.facebook.com" "fa fa-facebook fa-2x"),
              renderListItem(ExternalIconLink "https://twitter.com" "fa fa-twitter fa-2x"),
              renderListItem(ExternalIconLink "https://plus.google.com" "fa fa-google-plus fa-2x"),
              renderListItem(ExternalIconLink "https://www.linkedin.com" "fa fa-linkedin fa-2x")
            ]
          ]
      ]
    ]
  ]

