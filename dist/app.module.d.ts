import { MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
export declare class AppModule implements OnModuleInit {
    private dataSource;
    constructor(dataSource: DataSource);
    onModuleInit(): void;
    configure(consumer: MiddlewareConsumer): void;
}
