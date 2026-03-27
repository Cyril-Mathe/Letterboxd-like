import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Letterboxd-like API',
      version: '1.0.0',
      description: 'API documentation for Letterboxd-like movie application',
      contact: {
        name: 'API Support',
        email: 'support@letterboxd-like.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.letterboxd-like.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            email: {
              type: 'string',
              example: 'user@example.com'
            },
            username: {
              type: 'string',
              example: 'username'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Movie: {
          type: 'object',
          properties: {
            imdbID: {
              type: 'string',
              example: 'tt0111161'
            },
            Title: {
              type: 'string',
              example: 'The Shawshank Redemption'
            },
            Year: {
              type: 'string',
              example: '1994'
            },
            Poster: {
              type: 'string',
              example: 'https://example.com/poster.jpg'
            },
            imdbRating: {
              type: 'string',
              example: '9.3'
            }
          }
        },
        Review: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            movieId: {
              type: 'string',
              example: 'tt0111161'
            },
            userId: {
              type: 'integer',
              example: 1
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 10,
              example: 9
            },
            comment: {
              type: 'string',
              example: 'Great movie!'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            error: {
              type: 'string'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/swagger.routes.ts',
    './src/routes/routes.ts',
    './src/controllers/User/auth.ts',
    './src/controllers/User/users.ts',
    './src/controllers/Reviews/reviews.ts',
    './src/controllers/Movies/watchedMovies.ts'
  ]
};

export const specs = swaggerJsdoc(options);
