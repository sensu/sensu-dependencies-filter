function dependencies(event) {

    var deps = extractDependencies(event);

    // if there are no dependencies, the event is allowed
    if (deps.length == 0) {
      return true;
    } else {
      return sensu.CheckDependencies(deps);
    }
}

function extractDependencies(event) {
    var deps = [];
    var raw_deps = [];

    if (event.hasOwnProperty("check") && event.check.hasOwnProperty("annotations") && event.check.annotations.hasOwnProperty("dependencies")) {
        event.check.annotations.dependencies.split(",").forEach(function(dep) {
          raw_deps.push(dep);
        });
    }

    if (event.hasOwnProperty("entity") && event.entity.hasOwnProperty("annotations") && event.entity.annotations.hasOwnProperty("dependencies")) {
        event.entity.annotations.dependencies.split(",").forEach(function(dep) {
          raw_deps.push(dep);
        });
    }

    raw_deps.forEach(function(dep) {
      // if a dependency string matches our regex, we'll treat it as an entity check pair. otherwise, its a bare check name.
      res = dep.match(/^([\w\.\-]+)\/([\w\.\-]+)$/);
      if(res && res.length == 3) {
        deps.push({entity: res[1], check: res[2]});
      } else {
        deps.push(dep);
      }
    });

    return deps;
}
