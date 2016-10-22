module Components.LoremIpsum exposing (paragraphs)

import Html exposing (Html, p, text, span)
import String
import List

import Types exposing (Msg)

createHtmlParagraph : String -> Html Msg
createHtmlParagraph line =
  p [] [ text line ]

lines : Int -> List String
lines number =
  List.take number (String.lines rawText)

paragraphs : Int -> Html Msg
paragraphs number =
  span [] (List.map createHtmlParagraph (lines number))

rawText : String
rawText =
  """Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quamquam in hac divisione rem ipsam prorsus probo, elegantiam desidero. Quamvis enim depravatae non sint, pravae tamen esse possunt. Sed quod proximum fuit non vidit. Duo Reges: constructio interrete. Bestiarum vero nullum iudicium puto. Quam nemo umquam voluptatem appellavit, appellat; Ut proverbia non nulla veriora sint quam vestra dogmata. Sed haec quidem liberius ab eo dicuntur et saepius. Quamquam haec quidem praeposita recte et reiecta dicere licebit. Age, inquies, ista parva sunt.
Nec lapathi suavitatem acupenseri Galloni Laelius anteponebat, sed suavitatem ipsam neglegebat; Ergo illi intellegunt quid Epicurus dicat, ego non intellego? Sed in rebus apertissimis nimium longi sumus. A primo, ut opinor, animantium ortu petitur origo summi boni.
At miser, si in flagitiosa et vitiosa vita afflueret voluptatibus. Restinguet citius, si ardentem acceperit. Igitur neque stultorum quisquam beatus neque sapientium non beatus. Hoc dixerit potius Ennius: Nimium boni est, cui nihil est mali. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Hoc ne statuam quidem dicturam pater aiebat, si loqui posset.
Hoc tu nunc in illo probas. Non dolere, inquam, istud quam vim habeat postea videro; Egone quaeris, inquit, quid sentiam? Ut placet, inquit, etsi enim illud erat aptius, aequum cuique concedere. Nam ista vestra: Si gravis, brevis; Sed nimis multa. Poterat autem inpune; Vestri haec verecundius, illi fortasse constantius. At quicum ioca seria, ut dicitur, quicum arcana, quicum occulta omnia? Idemne, quod iucunde?
Cur deinde Metrodori liberos commendas? Quae similitudo in genere etiam humano apparet. Praeteritis, inquit, gaudeo. Consequens enim est et post oritur, ut dixi. Videsne, ut haec concinant? Quamquam te quidem video minime esse deterritum. Frater et T. Sint modo partes vitae beatae."""

