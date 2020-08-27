function test_allow_no_dependencies() {
  var event = {
    "metadata": {
      "namespace": "default"
    },
    "entity": {
      "metadata": {
        "annotations": {},
        "labels": {}
      }
    },
    "check": {
      "metadata": {
        "annotations": {},
        "labels": {}
      }
    }
  };

  var result = classicDependencies(event);

  if (result) {
    console.log("passed ✅ allow event with no dependencies");
  } else {
    console.log("failed 🛑 something went wrong, should have returned true to allow event with no dependencies");
  }
}

function test_extract_no_dependencies() {
  var event = {
    "metadata": {
      "namespace": "default"
    },
    "entity": {
      "metadata": {
        "annotations": {},
        "labels": {}
      }
    },
    "check": {
      "metadata": {
        "annotations": {},
        "labels": {}
      }
    }
  };

  var result = extractDependencies(event);

  if (result && result.length == 0) {
    console.log("passed ✅ expected zero dependencies, extracted zero");
  } else {
    console.log("failed 🛑 something went wrong");
  }
}

function test_extract_simple_check_dependencies() {
  var event = {
    "metadata": {
      "namespace": "default"
    },
    "entity": {
      "annotations": {},
      "labels": {}
    },
    "check": {
      "annotations": {
        "dependencies": "webserver,printer"
        },
      "labels": {}
    }
  };

  var result = extractDependencies(event);

  if (result && result.length == 2) {
    console.log("passed ✅ expected two simple dependencies from check, extracted two");
  } else {
    console.log("failed 🛑 something went wrong extracting check dependencies");
  }
}

function test_extract_simple_entity_dependencies() {
  var event = {
    "metadata": {
      "namespace": "default"
    },
    "entity": {
      "annotations": {"dependencies": "webserver,printer"},
      "labels": {}
    },
    "check": {
      "annotations": {},
      "labels": {}
    }
  };

  var result = extractDependencies(event);

  if (result && result.length == 2) {
    console.log("passed ✅ expected two simple dependencies from entity, extracted two");
  } else {
    console.log("failed 🛑 something went wrong extracting entity dependencies");
  }
}

function test_extract_simple_check_and_entity_dependencies() {
  var event = {
    "metadata": {
      "namespace": "default"
    },
    "entity": {
      "annotations": {"dependencies": "switch01,gateway"},
      "labels": {}
    },
    "check": {
      "annotations": {"dependencies": "webserver,database"},
      "labels": {}
    }
  };

  var result = extractDependencies(event);

  if (result && result.length == 4) {
    console.log("passed ✅ expected four simple dependencies (two from check, two from entity), extracted four");
  } else {
    console.log("failed 🛑 something went wrong extracting entity+check dependencies");
  }
}

function test_extract_dependency_pairs() {
  var event = {
    "metadata": {
      "namespace": "default"
    },
    "entity": {
      "annotations": {"dependencies": "switch_01/port-10"},
      "labels": {}
    },
    "check": {
      "annotations": {},
      "labels": {}
    }
  };

  var result = extractDependencies(event);

  if (result && result.length == 1) {
    console.log("passed ✅ expected one entity/check pair dependency, extracted one");
    if (result[0].entity == "switch_01" && result[0].check == "port-10") {
      console.log("passed ✅ entity/check pair dependency matched expected entity and check name");
    } else {
      console.log("failed 🛑 unexpected entity and check names. entity: " + result[0].entity + ", check: " + result[0].check);  
    }
  } else {
    console.log("failed 🛑 something went wrong extracting entity/check pair dependency");
  }
}

test_allow_no_dependencies();
test_extract_no_dependencies();
test_extract_simple_check_dependencies();
test_extract_simple_entity_dependencies();
test_extract_simple_check_and_entity_dependencies();
test_extract_dependency_pairs();