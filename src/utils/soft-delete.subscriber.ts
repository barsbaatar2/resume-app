import { EntitySubscriberInterface, EventSubscriber, getConnection, InsertEvent, SelectQueryBuilder } from 'typeorm';
// import { BeforeQueryEvent } from 'typeorm/subscriber/event/QueryEvent';
import { RequestContextService } from './request-context.service';
import { Inject, Injectable } from '@nestjs/common';
import { query } from 'express';

@EventSubscriber()
export class SoftDeleteSubscriber implements EntitySubscriberInterface<any> {
  listenTo() {
    return 'all';
  }

  beforeInsert(event: InsertEvent<any>) {
  }

  beforeSelect(event: any) {
    const alias = event.metadata.targetName;
    const qb: SelectQueryBuilder<any> = event.queryBuilder;

    qb.andWhere(`${alias}.deleted_at IS NULL`);
  }
}
