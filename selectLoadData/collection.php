<?php

// You can do a request in a table defined by "collection" and an column defined by "label"
// ex : SELECT id,".$_POST['label']." label FROM ".$_POST['collection']." ORDER BY ".$_POST['label']."

// Some country for the exemple.
if(isset($_POST['collection']) && isset($_POST['label'])) {
  if($_POST['collection']=='country' && $_POST['label']=='name') {

    echo '
    {"data" : [
      {
      "id" : "AF",
      "label" : "Afghanistan",
      },
      {
      "id" : "AL",
      "label" : "Albania",
      },
      {
      "id" : "DZ",
      "label" : "Algeria",
      },
      {
      "id" : "AS",
      "label" : "American Samoa",
      },
      {
      "id" : "AD",
      "label" : "Andorra",
      },
      {
      "id" : "AO",
      "label" : "Angola",
      },
      {
      "id" : "AI",
      "label" : "Anguilla",
      },
      {
      "id" : "AQ",
      "label" : "Antarctica",
      },
      {
      "id" : "AG",
      "label" : "Antigua and Barbuda",
      },
      {
      "id" : "AR",
      "label" : "Argentina",
      },
      {
      "id" : "AM",
      "label" : "Armenia",
      },
      {
      "id" : "AW",
      "label" : "Aruba",
      },
      {
      "id" : "AU",
      "label" : "Australia",
      },
      {
      "id" : "AT",
      "label" : "Austria",
      },
      {
      "id" : "AZ",
      "label" : "Azerbaijan",
      },
      {
      "id" : "BS",
      "label" : "Bahamas",
      },
      {
      "id" : "BH",
      "label" : "Bahrain",
      },
      {
      "id" : "BD",
      "label" : "Bangladesh",
      },
      {
      "id" : "BB",
      "label" : "Barbados",
      },
      {
      "id" : "BY",
      "label" : "Belarus",
      }
    ]}
    ';

  }
}
else {
  echo '{"data" : [{"id":"null",label:"Empty"}]}';
}