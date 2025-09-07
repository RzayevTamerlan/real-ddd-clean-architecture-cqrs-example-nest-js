# Advanced NestJS Architecture: A DDD, Clean & CQRS Example

This repository provides a production-ready template and a practical, in-depth example of building a robust and scalable application using **NestJS**. The primary goal is to demonstrate a sophisticated implementation of modern software architecture principles, focusing on **Domain-Driven Design (DDD)**, **Clean Architecture**, and **Command Query Responsibility Segregation (CQRS)**.

The `User` module is fully implemented to serve as a comprehensive, real-world showcase of this architectural style.

## Core Architectural Principles

This project is built on a foundation of key architectural patterns that work in harmony to create a system that is decoupled, highly testable, and easy to maintain and evolve.

### 1. The Clean Architecture

The project is strictly divided into four distinct layers. The golden rule is that **dependencies can only point inwards**. The core business logic knows nothing about the database, the API, or any other external concern.

-   **`Domain` (The Core):** The heart of the application. It contains the business entities (Aggregates), Value Objects, and Domain Events. This layer has **zero dependencies** on any other layer. It represents the business rules in their purest form.
-   **`Application` (The Use Cases):** Orchestrates the business logic. It contains the application's use cases, implemented as **Commands** and **Queries**. It defines the "what" the application can do but delegates the "how" to the Domain layer.
-   **`Infrastructure` (The Details):** The layer that contains the implementation details and technologies. This includes database repositories (using MikroORM), mappers, and event dispatchers. It implements the interfaces (ports) defined by the Application and Domain layers.
-   **`Presentation` (The Entrypoint):** The entry point to the application. In this project, it's the HTTP API layer, containing controllers and Data Transfer Objects (DTOs). It is responsible for handling web requests and translating them into Commands or Queries.

### 2. Command Query Responsibility Segregation (CQRS)

We strictly separate operations that change state from those that only read it.

-   **Commands:** Actions that mutate (change) the state of the system (e.g., `CreateUserCommand`, `ChangePasswordCommand`). They are imperative, named with verbs, and do not return data beyond a success/failure indicator.
-   **Queries:** Actions that read the state of the system without changing it (e.g., `GetUserByIdQuery`). They are idempotent and return specialized DTOs (Read Models) tailored for the client's needs.

### 3. Domain-Driven Design (DDD)

We model our software around the business domain, ensuring the code is a direct reflection of business rules.
-   **Aggregate:** A cluster of domain objects treated as a single unit. Our `User` model is the **Aggregate Root**.
-   **Value Object:** An immutable object whose identity is based on its attributes, not a unique ID (e.g., `Password`, `Email`, `PersonName`). So, two Value Objects with the same attributes are considered equal.
-   **Repository:** An abstraction over the persistence layer, providing a clean interface for the Application layer to access domain objects.
-   **Unit of Work:** A pattern that tracks changes to aggregates and commits them to the database atomically (in one transaction).
-   **Domain Event:** A record of something significant that happened in the domain. Used for decoupling side effects (e.g., sending an email after a user is created).

## Technology Stack

-   **Framework:** [NestJS](https://nestjs.com/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **ORM:** [MikroORM](https://mikro-orm.io/) (leveraging its built-in Unit of Work and Identity Map patterns)
-   **CQRS:** `@nestjs/cqrs` module
-   **Events:** `@nestjs/event-emitter` for domain event dispatching
-   **Validation:** `class-validator` for robust, declarative validation
-   **API Documentation:** [Swagger (@nestjs/swagger)](https://docs.nestjs.com/openapi/introduction)
-   **Containerization:** [Docker](https://www.docker.com/)

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
-   [Docker](https://www.docker.com/) and Docker Compose

### Installation & Running

1.  **Clone the repository**
    ```bash
    git clone https://github.com/RzayevTamerlan/real-ddd-clean-architecture-cqrs-example-nest-js
    cd real-ddd-clean-architecture-cqrs-example-nest-js
    ```

2.  **Run the application in development mode**
    This command builds and starts the Docker containers for the NestJS application and the PostgreSQL database. The `-d` flag runs the containers in detached mode.
    ```bash
    docker-compose --env-file .env.development.local -f docker-compose.dev.local.yml up --build -d
    ```
    -   The application will be available at `http://localhost:8080/api`.
    -   The Swagger API documentation will be at `http://localhost:8080/api/docs`.

If you need to run tests, you have to download Node.js v20+, install Yarn and dependencies. After that, you can run the tests with:
```bash
yarn test
```

## Project Structure Overview

The project is organized by feature (`user`), with each feature module containing its own Clean Architecture layers. This approach is highly scalable.

```
src
├── user/
│   ├── application/                # Application Layer (Use Cases)
│   │   ├── commands/               # Command definitions and handlers
│   │   ├── queries/                # Query definitions and handlers
│   │   ├── dto/                    # Data Transfer Objects for query responses (Read Models)
│   │   └── repositories/           # Repository interfaces (Ports)
│   │   └── event-handlers/         # Event handlers
│   │   └── mappers/                # Mappers (Domain <-> DTO for presentation layer)

│   │
│   ├── domain/                     # Domain Layer (Business Logic)
│   │   ├── enums/                  # Domain-specific enums
│   │   ├── events/                 # Domain event definitions
│   │   ├── value-objects/          # Value Objects (Email, Password, etc.)
│   │   └── user.model.ts           # The User Aggregate Root
│   │
│   ├── infrastructure/             # Infrastructure Layer (Implementation Details)
│   │   └── persistence/
│   │       ├── mikro-orm/
│   │       │   ├── entities/       # Database entities for MikroORM
│   │       │   ├── mappers/        # Mappers (Domain <-> Entity)
│   │       │   └── repositories/   # Repository implementations (Adapters)
│   │
│   └── presentation/               # Presentation Layer (API)
│       └── http/
│           ├── dtos/               # DTOs for API requests (with validation)
│           └── user.controller.ts  # The API controller
│
└── shared/                         # Code shared across all modules
    ├── application/                # Shared application logic (BaseController, Filters, etc.)
    ├── domain/                     # Shared domain logic (AggregateRoot, DomainError)
    ├── configs/                    # Shared configuration (DB, JWT, etc.)
    ├── utils/                      # Shared utilities (Result type, functions, classes)
    └── infrastructure/             # Shared infrastructure (UoW, event dispatcher)
```

## Architectural Flow: Tracing a `POST /users` Request

To make the architecture concrete, here is the lifecycle of a request to create a new user:

1.  **Controller (`user.controller.ts`):** The request hits the `createUser` method.
2.  **DTO Validation (`ValidationPipe`):** The incoming JSON body is validated against the `CreateUserDto`. If it fails, a `400 Bad Request` is returned immediately.
3.  **Command Creation:** The controller creates a `new CreateUserCommand(dto)`. The command's constructor validates the data against its own internal rules. If it fails, it throws a `DomainError.validation`.
4.  **Exception Handling (`GlobalExceptionsFilter`):** The thrown `DomainError` is caught by our global filter, which transforms it into a formatted `422 Unprocessable Entity` HTTP response.
5.  **Dispatching (`CommandBus`):** If the command is valid, it's dispatched via the `commandBus`.
6.  **Handler (`create-user.handler.ts`):** The `CreateUserCommandHandler` receives the command.
7.  **Repository Interaction:** The handler uses the `IUserRepository` to check if a user with that email already exists. If so, it returns a `Result.failure(DomainError.conflict(...))`.
8.  **Domain Logic:** The handler calls the static factory method `User.create(command)`. The `User` domain model hashes the password, sets default values (`status`), and registers a `UserCreatedEvent` within itself.
9.  **Persistence (`UnitOfWork`):** The handler calls `userRepository.save(user)`. The `MikroOrmUserRepository` uses `em.persist()` to add the new user entity to the **Unit of Work**. It **does not** hit the database yet.
10. **Transaction Commit:** The `CommandHandlerBase` calls `unitOfWork.commitChanges()`, which triggers `em.flush()`. MikroORM now runs the `INSERT` query inside a transaction.
11. **Event Dispatching:** After the transaction is successfully committed, `CommandHandlerBase` dispatches the `UserCreatedEvent` via the `IDomainEventDispatcher`.
12. **Event Handling (`user-created.handler.ts`):** The `UserCreatedEventHandler` is triggered and performs side effects, such as sending a welcome email.