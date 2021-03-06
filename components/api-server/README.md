# Pryv API server

Node.js / Express server to manage user activity and user administration requests.


## Usage

### Running the server

```bash
node src/server [options]
```

See [the root README](https://github.com/pryv/service-core/blob/master/README.md#about-configuration) to learn about configuration options.


### API

See the [Pryv API reference documentation](https://pryv.github.io/reference/).

### Nightly

The _[bin](https://github.com/pryv/service-core/tree/release-1.3/components/api-server/bin)_ folder contains a binary called _[nightly](https://github.com/pryv/service-core/blob/release-1.3/components/api-server/bin/nightly)_, which performs maintenance tasks such as computing and updating the storage usage for each existing users.

This binary can be manually executed with the following command (or be setup as cronjob):
> node dist/components/api-server/bin/nightly --config config.json

The same command for a dockerized api-server would look like this:
> docker exec -ti pryv_core_1 app/bin/dist/components/api-server/bin/nightly --config app/conf/core.json

Note that these tasks can induce a heavy load on MongoDB, especially if the computation has to iterate through a lot of users.

## Contribute

Make sure to check the root README first.


### About event types definitions

The server tries to validates incoming event data for known types.
The default source for event types definitions is in `schema/default-event-types.json`, and this file
must be kept up-to-date by running `yarn run update-event-types`, which fetches the "official"
version published online.
(The server also tries to update this asynchronously at startup but fallbacks to the default definitions
in the meantime and if the online version is unavailable or corrupted.)


### Tests

- `yarn run test` (or `yarn test`) for quiet output
- `yarn run test-detailed` for detailed test specs and debug log output
- `yarn run test-profile` for profiling the tested server instance and opening the processed output with `tick-processor`
- `yarn run test-debug` is similar as `yarn run test-detailed` but in debug mode; it will wait for debuggers to be attached on both ports 5858 (the test process) and 5959 (the tested server process)

Note that acceptance tests covering the API methods use the HTTP API (that was implemented first); acceptance tests using Socket.IO only cover socket-specific functionality, not API commands.

#### Run specific test(s)

You can pass options to mocha using `--` in the following way `yarn run test -- --grep="Socket"`


# License
Copyright (c) 2020 Pryv S.A. https://pryv.com

This file is part of Open-Pryv.io and released under BSD-Clause-3 License

Redistribution and use in source and binary forms, with or without 
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, 
   this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, 
   this list of conditions and the following disclaimer in the documentation 
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE 
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

SPDX-License-Identifier: BSD-3-Clause
