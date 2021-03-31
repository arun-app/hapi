'use strict';

const Hapi = require('@hapi/hapi');
const Bell = require('@hapi/bell');
const Joi = require('joi')
const config =require ('./config')
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    //     routes: { 
    //         files: {  
    //             files: {
    //             relativeTo: Path.join(__dirname, 'public')
    //         }
    //     }
    // }
    });

    await server.register(Bell);    
    await server.register(require('@hapi/vision'));
    await server.register(require('@hapi/inert'));

    server.auth.strategy('google', 'bell', config.googleAuth);

    // server.views({
    //     engines: {
    //         pug: require('pug')
    //     },
    //     relativeTo: __dirname,
    //     path: 'views'
    // });

    server.route({
        method: '*', 
        path: '/auth/google',          
        handler: function (request, h) {
    
            if (!request.auth.isAuthenticated) {
                return `Authentication failed due to: ${request.auth.error.message}`;
            }
            else{
                let res={
                    access:request.auth.credentials.token,
                    accessExpiry:request.auth.credentials.expiresIn,
                    user:{
                        name:request.auth.credentials.profile.displayName,
                        email:request.auth.credentials.profile.email
    
                    }
                }
        console.log(res)
        return h.response(res);
            }
          
            // return h.response(res);
            // return h.redirect('/');
        },
        options: {
            auth: {
              strategy: 'google',
              mode: 'try'
            }
        }
    });

    server.route({ //JOi validation
        method: 'POST',
        path: '/post',
        handler: (request, h) => {
    
            return 'Blog post added!';
        },
        // options: {
        //     validate: {
        //         payload: Joi.object({
        //             post: Joi.string().min(1).max(140).
        //         })
        //     }
        // }
    });


    const bookSchema = Joi.object({ //o/p validation
        title: Joi.string().required(),
        author: Joi.string().required(),
        isbn: Joi.string().length(10),
        pageCount: Joi.number(),
        datePublished: Joi.date().iso()
    });
    
    server.route({
        method: 'GET',
        path: '/books',
        handler: async function (request, h) {
            return await getBooks();
        },
        options: {
            response: {
                schema: Joi.array().items(bookSchema),
                failAction: 'log'
            }
        }
    });

    
    // server.ext('onRequest', function (request, h) {
    //     // What this function will do is reroute all requests to the '/test' route.
    //     request.setUrl('/test');
    //     return h.continue;
    // });
   
    // onRequest, onPreAuth, onCredentials, onPostAuth, onPreHandler, onPostHandler, and onPreResponse.

    // cookie-parser  //To use cookies in hapi, you first configure the cookie with 
    // server.state('data', {
    //     ttl: null,  
    //     isSecure: true,
    //     isHttpOnly: true
    // });


    // server.route({METHOD, PATH, HANDLER})
    server.route({
        method: 'GET', 
        // method: '*'.              // all methods
        //  method: ['PUT', 'POST'],
        //  path: '/hello/{name}', // '/hello/{name?}'
        path: '/test',
        // handler: { // serve static file
        //     file: 'image.jpg'
        // directory: {  //Now, you can access any static files by going to localhost:3000/filename
        // set this path above      // path: '/{param*}',
        //     path: '.'
        // }
        // }
        handler: (request, h) => {
            const email = request.payload.email;
            const name = request.params.name; //request.query.
            h.state('data', 'tom');  //send cookie from server.state
            // return h.response(request.state.data);   //Getting a Cookie Value
        // return 'Hello ' + name +email;
        return h.redirect('/');
        // hapi has the functionality to respond with JSON data by default

        // return h.file('image.jpg'); // send static file

        //Rendering a View

        // return h.view('index', { title: 'Homepage', message: 'Welcome' });
// or using the view handler in hapi:
// view: {
//     template: 'index',
//     context: {
//         title: 'Homepage',
//         message: 'Welcome'
//     }
// }

// throw Boom.notFound('Page not found');
        },
    });
    // h.file()     serving static files.
    server.route({
        method: 'GET', 
        path: '/',
        handler: (request, h) => {
        return "fff"
        }
    });
    
    // h.getDate()
    await server.register({  //Loading a Plugin
        plugin: getDate,
        options: {
            name: 'Tom'
        }
    });
    
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();