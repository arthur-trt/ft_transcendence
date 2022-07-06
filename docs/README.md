# ft_transcendance : back end focus

- [ft_transcendance : back end focus](#ft_transcendance--back-end-focus)
	- [Introduction](#introduction)
	- [NEST JS](#nest-js)
		- [Controller Service Modules](#controller-service-modules)
			- [Controllers](#controllers)
			- [Providers](#providers)
			- [Modules](#modules)
			- [Pipes](#pipes)
			- [Definition : MVC model](#definition--mvc-model)
			- [Decorators](#decorators)
				- [Injectable](#injectable)
				- [Body, Param](#body-param)
					- [Body](#body)
					- [Params](#params)
					- [IsNotEmpty](#isnotempty)
		- [Databases](#databases)
			- [PostgreSQL](#postgresql)
			- [TypeOrm](#typeorm)
				- [Relations in TypeOrm](#relations-in-typeorm)
			- [Keep relations](#keep-relations)
			- [Parameters](#parameters)
				- [SQL queries](#sql-queries)
				- [Websockets](#websockets)

## Introduction

## NEST JS

npm run build to transpile (= compilation langage to langage).

### Controller Service Modules

#### Controllers

Controllers are charged with receiving requests from clients and giving responses depending on what was programmed. They are used for routing, defining endpoints with resources, defining routes with parameters, redirecting, defining status code for different endpoints, and so on. To use the controller in typescript, you need to use the nest controller decorator @Controller() followed by its associated class, you can also add an optional route path to a controller, for example@Controller(‘users’). A controller can have as many endpoints or resources as possible. For instance, we can use the Get decorator attached to a method to fetch all customers in a database, and a post decorator with the endpoint create to create a new user.

#### Providers

Providers are most of the time classes, that can be injected as a dependency to other classes such as the controller class. They are used as services for controller resources. In the code above, UserService was injected into the user's controller, this served as a dependency for the user's controller and we can therefore use userService methods in the controller's class.[^1]

Providers include :

- Services
- Repositories
- Factories
- Helpers

__Property__ : it can be __injected__ as a dependency

[^1]:from <https://blog.devgenius.io/setting-up-nestjs-with-postgresql-ac2cce9045fe>

#### Modules

Both the controllers are provider classes are defined in the module. You can decide to create a different module for different functions, for example, the users’ module for all users’ functions. These sub-modules would be imported to the app module which is the main app module for our project. Other needed modules are also imported in the module.ts file, such as the typeorm module, configuration module, and so on.

#### Pipes

<https://docs.nestjs.com/pipes>

Two main purpose

- Validation
- Transformation

Ex 1 : want to handle the input as a number

``` ts

@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

-> We use ParseIntPipi to validate the fact the input could be transformed into JS number.
eg : GET localhost:3000/abc : will throw an erroe
 GET localhost:3000/123 will transform '123' into 123 as integer. FindOne method will not be exectued.

 Note : here, we see that we already pass the class ParseInt, and not an instance. We could have wanted to add some options. Then we could have done:

 ``` ts

@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}
```

... and then, we modify the built-in pipes.

#### Definition : MVC model

####

Create services, modules, cotrollers for car

``` js
nest g controller car
nest g service car
```

Will auto generate CarModule. CarController, etc.
Will be in imports, in app.module.ts.

export class modules we want to import in app.moduels

maon.ts will just import AppModule.

#### Decorators

##### Injectable

-> when a class has a dependancy, use Injectable. It will add metadata to JS, in metadata:params. Will like create an instance needed for consructor.
From Angular.
See more : <https://www.youtube.com/watch?v=dyBUOQT6Ric>

##### Body, Param

###### Body

``` js
public async postCar(@Body() car: CarDto) {
  return this.carService.postCar(car);
 }
```

=> DTO is oimportant for validation ; wioll make sure the body sent is comp[liant with sent data

See more about class-va;idator package and validation in general : <https://progressivecoder.com/how-to-use-inbuilt-nestjs-validationpipe/>

Answer from SO :

``` txt
It is injected into the function as an argument.

The @body decorator basically says:
Please cast the json that arrives in the request body into IUserBase type and place it as a parameter to this controller's handler.
```

According to doc :

``` txt
Route handler parameter decorator. Extracts the entire body object from the req object and populates the decorated parameter with the value of body.

For example:

async create(@Body() createDto: CreateCatDto)
```

<https://stackoverflow.com/questions/59806597/understanding-the-body-decorator-in-nestjs>

###### Params

``` js
 @Get(':id')
 public async getCarById(@Param('id') id: number) {
  return this.carService.getCarById(id);
 }
```

For example, extracting all params:

findOne(@Param() params: string[])
For example, extracting a single param:

findOne(@Param('id') id: string)

###### IsNotEmpty

### Databases

#### PostgreSQL

_PostgreSQL is an advanced, enterprise-class, and open-source relational database system. PostgreSQL supports both SQL (relational) and JSON (non-relational) querying._

_PostgreSQL is a highly stable database backed by more than 20 years of development by the open-source community._

How to start on Mac if :
> __Start manually__
> ```pg_ctl -D /usr/local/var/postgres start```
> __Stop manually__
> ```pg_ctl -D /usr/local/var/postgres stop```
__Start automatically__
>"To have launchd start postgresql now and restart at login:"
> ```brew services start postgresql```

Interactive terminal (few commands):
[Doc](https://www.postgresql.org/docs/current/app-psql.html)
<https://www.postgresguide.com/utilities/psql/>
```psql -d database```

- Show all tables in db : ``` \d ```
- Show details of a table : ``` \d "Car" ```
- Quit : ``` \q ```
- Connect to another database: ```\c dbname```

Sometimes we will see strange syntax like :
``` nextval('"Car_id_seq"'::regclass) ```

It created a sequence table. For example after a \d we will see  :
 ``` public | Car_id_seq       | sequence | postgres ```

According to [Postgresql doc](https://www.postgresql.org/docs/current/functions-sequence.html):
This section describes functions for operating on sequence objects, also called sequence generators or just sequences. Sequence objects are special single-row tables created with CREATE SEQUENCE. Sequence objects are commonly used to generate unique identifiers for rows of a table.

#### TypeOrm

Definition from [doc](https://typeorm.io/)
> TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8). Its goal is to always support the latest JavaScript features and provide additional features that help you to develop any kind of application that uses databases - from small applications with a few tables to large scale enterprise applications with multiple databases.

It will help us to create a database.
Make the junction between providers and DB.

Entities : where we define the prototypes of tables
Hint : see autoLoadEntities.

>Manually adding entities to the entities array of the data source options can be tedious. In addition, referencing entities from the root module breaks application domain boundaries and causes leaking implementation details to other parts of the application. To address this issue, an alternative solution is provided. To automatically load entities, set the autoLoadEntities property of the configuration object (passed into the forRoot() method) to true, as shown below:

``` js
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
```

>With that option specified, every entity registered through the forFeature() method will be automatically added to the entities array of the configuration object.

Full example from NestJS docs with a photo midule:

__STEP 1 : CREATING A CONNECTION WITH A DATABASE__

It is a global database provider.

We use : DataSource, and no more create connection.
Source :  <https://github.com/typeorm/typeorm/issues/7428>

``` ts

import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'test',
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];

```

⚠️ Warning : ``` synchronize : true ``` MUST NOT be set in production ; risk to loose data.
<https://typeorm.biunav.com/en/data-source.html#creating-a-new-datasource>

__STEP 2 : EXPORT PROVIDERS VIA MODULE TO MAKE THEM ACCESSIBLE__

```ts
/* database.module.ts - JS */


import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}


```

__STEP 3 : MAKING AN ENTITY__

``` ts
/* photo.entity.ts - JS */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  @Column()
  filename: string;

  @Column('int')
  views: number;

  @Column()
  isPublished: boolean;
}


```

MAKING A REPOSITORY ?

Repository : each entity has a repository containing a ceertain nb of fucntion.
Repository providers through providers.ts :

``` ts
/* photo.providers.ts - JS */


import { DataSource } from 'typeorm';
import { Photo } from './photo.entity';

export const photoProviders = [
  {
    provide: 'PHOTO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Photo),
    inject: ['DATA_SOURCE'],
  },
];
```

Repositories provide FUNCTIONS:

-> For example, save. ``` reponame.save(object) ``` will save the gioven entity into the database. Very simple.
<https://www.tutorialspoint.com/typeorm/typeorm_working_with_repository.htm>

Here is explained how does Inject Repository is used :
<https://stackoverflow.com/questions/65938257/how-does-injectrepository-work-internally-in-nestjs>

__STEP 4 : inject Repository< Photo > to Photo.service.ts___

``` ts
/* photo.service.ts */


import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';

@Injectable()
export class PhotoService {
  constructor(
    @Inject('PHOTO_REPOSITORY')
    private photoRepository: Repository<Photo>, // Photo Entity !
  ) {}

  async findAll(): Promise<Photo[]> {
    return await this.photoRepository.find();
  }
}

```

Nb. From what I understand, instead of Inject()('string'), we could simply use "Inject Repository"
From [here](https://stackoverflow.com/questions/65938257/how-does-injectrepository-work-internally-in-nestjs)
> @InjectRepository() on the other hand is an extension of @Inject() that takes the currently passed entity/repository and uses some logic to create a new injection token.

_STEP 5 : MAKE THE PHOO MODULE + IMPORTS THE DATABASE MODULE + PROVIDERS & SERVICE__

PhotoModule :

``` ts
/* photo.module.ts */


import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { photoProviders } from './photo.providers';
import { PhotoService } from './photo.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...photoProviders,
    PhotoService,
  ],
})
export class PhotoModule {}


```

__________

Another tutorial at
<https://docs.nestjs.com/techniques/database>
with @Inject REpository

##### Relations in TypeOrm

Many to on and one to many in docs;

Example, we have Photos and User class.

- One user can have many photo => One to Many with @OneToMany decorator
- Many photo are related to one user => Many to one with @ManyToOne decorator()

Loading with relations:
```const car = this.carRepo.findOne({ where: { id: carId } , relations : ['wheelscolor'] });```

ALSO WORKS WITH QUERY BUIKLDER :
``` const myquery = this.carRepo.createQueryBuilder("car").where("car.id = :id", { id: carId }).leftJoinAndSelect("car.wheelscolor", "wheelscolor").getMany(); ```

that emulates this query :
``` SELECT "car"."id" AS "car_id", "car"."brand" AS "car_brand", "car"."color" AS "car_color", "wheelscolor"."id" AS "wheelscolor_id", "wheelscolor"."color" AS "wheelscolor_color", "wheelscolor"."carId" AS "wheelscolor_carId" FROM "Car" "car" LEFT JOIN "wheel" "wheelscolor" ON "wheelscolor"."carId"="car"."id" WHERE "car"."id" = :id ```

<https://typeorm.io/#loading-objects-with-their-relations>

More on relations
<https://orkhan.gitbook.io/typeorm/docs/relations>
wher

#### Keep relations

@nestjs/config


See thew dotenv packet to load .env file into
process.env


Error : "TypeError : x is not iterable"
=> Make sure that you loaded reelations in findOne for example.


#### Parameters

Query parameters

You have to remove :params for it to work as expected:

@Get('findByFilter')
async findByFilter(@Query() query): Promise<Article[]> {
  // ...
}

Path parameters

The :param syntax is for path parameters and matches any string on a path:

@Get('products/:id')
getProduct(@Param('id') id) {

matches the routes

localhost:3000/products/1
localhost:3000/products/2abc
// ...

Route wildcards

To match multiple endpoints to the same method you can use route wildcards:

@Get('other|te*st')

will match

localhost:3000/other
localhost:3000/test
localhost:3000/te123st
// ...

##### SQL queries

Create Query Builder tuto :
https://orkhan.gitbook.io/typeorm/docs/select-query-builder

##### Websockets

- Websockets :

- Setting Nest gateways :  https://docs.nestjs.com/websockets/gateways


- Sockets.io :
https://socket.io/fr/docs/v4/ 

- Good tutorial specifically for websockets : https://www.youtube.com/watch?v=odOKUGUhgPU
Another good one : https://www.youtube.com/watch?v=eMc9EsD4uqI&list=PLVfq1luIZbSkICzoA8EuvTskPEROS68i9&index=8
linked to github https://github.com/ThomasOliver545/real-time-chat-nestjs-angular/blob/726aa89bced98a1adcc9843b42d57945a51b63e0/api/src/chat/gateway/chat.gateway.ts

Ideas : https://medium.com/@phatdev/build-a-real-time-chat-application-with-websocket-socket-io-redis-and-docker-in-nestjs-499c2513c18

3. Configuration options for WebSockets Gateway :
- We can modify listener port.

Make sure :
- You updated
