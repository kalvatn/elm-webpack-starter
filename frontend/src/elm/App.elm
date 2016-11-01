module App exposing (main)

import Navigation
import Routing
import State
import View

main : Program Never
main =
  Navigation.program (Navigation.makeParser (.hash >> Routing.hashParser))
    {
      init = State.initialState,
      update = State.update,
      urlUpdate = State.urlUpdate,
      subscriptions = State.subscriptions,
      view = View.rootView Routing.toUri
    }
