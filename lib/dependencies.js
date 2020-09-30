function coreDependencies(event) {

    var deps = extractDependencies(event);

    // if there are no dependencies, the event is allowed
    if (deps.length == 0) {
      //console.log("found no dependencies");
      return true;
    } else {
      console.log("found dependencies...");
      var str = JSON.stringify(deps, null, 4);
      console.log(str);
      var res = deps.some(checkDep);
      console.log("result: ");
      console.log(res);
      return !res;
    }
}

function checkDep(value, index, array) {
  // invert the value returned by sensu.CheckDependencies, as it returns false to indicate a match
  return !sensu.CheckDependencies(value);
}

function extractDependencies(event) {
    var deps = [];
    var raw_deps = [];

    if (event.hasOwnProperty("check") && event.check.hasOwnProperty("annotations") && event.check.annotations.hasOwnProperty("dependencies")) {
        event.check.annotations.dependencies.split(",").forEach(function(dep) {
          console.log("found raw check dependency: " + dep);
          raw_deps.push(dep);
        });
    }

    if (event.hasOwnProperty("entity") && event.entity.hasOwnProperty("annotations") && event.entity.annotations.hasOwnProperty("dependencies")) {
        event.entity.annotations.dependencies.split(",").forEach(function(dep) {
          console.log("found raw entity dependency: " + dep);
          raw_deps.push(dep);
        });
    }

    raw_deps.forEach(function(dep) {
      // if a dependency string matches our regex, we'll treat it as an entity check pair. otherwise, its a bare check name.
      res = dep.match(/^([\w\.\-]+)\/([\w\.\-]+)$/);
      if(res && res.length == 3) {
        //console.log("regex match: " + res);
        deps.push({entity: res[1], check: res[2]});
      } else {
        //console.log("regex didn't match, assuming no entity component");
        deps.push(dep);
      }
    });

    console.log("computed dependencies: ");
    var str = JSON.stringify(deps, null, 4);
    console.log(str);
    return deps;
}