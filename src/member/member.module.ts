import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberRepository } from './member.repository';
import { MemberService } from './member.service';
import RepositoryError from 'src/common/errors/repository-error';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { S3Module } from 'src/aws/s3/s3.module';

@Module({
  controllers: [MemberController],
  providers: [MemberRepository, MemberService, RepositoryError],
  imports: [FirebaseModule, S3Module],
})
export class MemberModule {}
