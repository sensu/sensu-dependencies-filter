## Core Dependencies Filter

- [Overview](#overview)
- [Usage examples](#usage-examples)
  - [Asset registration](#asset-registration)
  - [Filter definition](#filter-definition)
  - [Handler definition](#handler-definition)

### Overview

This Sensu Go filter looks for dependencies defined in check and entity annotations and invokes the [`sensu.CheckDependencies` query expression][1] to determine if any of the defined dependecies are in a non-OK state.

### coreDependencies

The `coreDependencies` function implemented by this library is intended as proof-of-concept reproduction of the [Sensu Core `dependencies` filter][2].

In Sensu Core the dependencies were expressed as an array. For this implementation I've chosen to use comma separated values.

#### Example: check dependencies

Given you have a check called `https-health` which monitors your website's /health endpoint, you want to suppress alerts from the `https-cert` check when `https-health` is in a non-OK state:

```yml
type: CheckConfig
api_version: core/v2
metadata:
  name: https-cert
  annotations:
    dependencies: https-health
spec:
  command: check-https-cert.rb --url https://www.example.com
  handlers:
  - pagerduty
  interval: 60
  subscriptions:
  - website
```

Provided that the `pagerduty` handler has been configured as shown below in Usage examples, the `dependencies` annotation with the value `https-health` will prevent alerts from `https-cert` from reaching pagerduty when `https-health` is not OK.

#### Example: entity dependencies

Given you have an agent running in a remote site with unreliable network link. Sometimes the ethernet cable falls out of port 5 on the switch, other times the ISP link fails. And yet you soldier on. It's fine.

You want to suppress alerts from any check this agent runs when either 
a. the `remote-site-link` is in a non-OK state
b. the state of check `port5` on entity `remote-switch` is in a non-OK state (`entity/check` syntax)

For an agent entity, you can set this in the agent.yml annotations:

```yml
# agent.yml
annotations:
  dependencies: remote-site-link,remote-switch/port5
```

Or whatever method as appropriate for the entity type or your Sensu version.

### Usage examples

#### Asset Registration

```
sensuctl asset add senmsu/sensu-dependencies-filter -r dependencies-filter
```

#### Filter definition

Define an event filter using the `coreDependencies` function. This function requires the event object as its only argument.

```yml
---
type: EventFilter
api_version: core/v2
metadata:
  name: dependencies
  namespace: default
spec:
  action: allow
  expressions:
  - coreDependencies(event)
  runtime_assets:
  - dependencies-filter
```

#### Handler definition

Add the filter to any of your existing handlers. Here's a Pagerduty handler with the above event filter applied:

```
---
type: Handler
api_version: core/v2
metadata:
  name: pagerduty
  namespace: default
spec:
  type: pipe
  command: sensu-pagerduty-handler
  timeout: 10
  runtime_assets:
  - sensu-pagerduty-handler
  filters:
  - dependencies-filter
```

### Acknowledgements

Inspired by Sensu Core [dependencies filter extension][1].

[1]: https://docs.sensu.io/sensu-go/latest/reference/sensu-query-expressions/#sensucheckdependencies
[2]: https://github.com/sensu/sensu-extensions-check-dependencies
[3]: #Usage-examples
