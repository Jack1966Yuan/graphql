const { RESTDataSource } = require('apollo-datasource-rest');

class LauchAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.spacexdata.com/v2/';
    }

    async getLaunchById({ launchId }) {
        const response = await this.get('launches', { flight_number: launchId });
        return this.launchReducer(response[0]);
    }

    getLaunchesByIds({ launchIds }) {
        return Promise.all(
            launchIds.map(launchId => this.getLaunchById({ launchId })),
        );
    }

    async getAllLaunches() {
        const response = await this.get('launches');
        return Array.isArray(response) ?
        response.map(launch => this.launchReducer(launch)) : [];
    }

    launchReducer(launch) {
        return {
            id: launch.flight_number || 0,
            cursor: `${launch.launch_date_unix}`,
            site: launch.launch_site && launch.launch_site.site_name,
            mission: {
                name: launch.mission_name,
                missionPatchSmall: launch.links.mission_patch_small,
                missionPatchLarge: launch.links.mission_patch,
            },
            rocket: {
                id: launch.rocket.rocket_id,
                name: launch.rocket.rocket_name,
                type: launch.rocket.rocket_type,
            },
        };
    }
}

module.exports = LauchAPI;


/*
SQLite
Here are some of the core concepts for creating your own data source:
The initialize method: You'll need to implement this method if you want to pass in any configuration options to your class.
this.context: A graph API's context is an object that's shared among
every resolver in a GraphQL request. We're going to explain this in more
detail in the next section. Right now, all you need to know
is that the context is useful for storing user information.
Caching: while the REST data source comes with its own built in catche, the
our UserPI DATA source to connect our SQL database, we need to add
ur graph Api.




class MoviesAPI extends RESTDataSource {
  baseURL = 'https://movies-api.example.com';

  async getMovie(id: string) {
    return this.get(`movies/${id}`);
  }

  async getMostViewedMovies(limit: number = 10) {
    const data = await this.get('movies', {
      per_page: limit,
      order_by: 'most_viewed',
    });
    return data.results;
  }
}

*/

