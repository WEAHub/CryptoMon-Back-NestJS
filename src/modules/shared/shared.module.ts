import { Global, Module } from '@nestjs/common';
import { SharedServicesModule } from './services/services.module';

@Global()
@Module({
	imports: [
    SharedServicesModule
	],
	exports: [
    SharedServicesModule
	]
})

export class SharedModule {

}
