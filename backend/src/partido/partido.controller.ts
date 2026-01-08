import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { FinalizarPartidoDto } from './dto/finalizar-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { PartidoService } from './partido.service';

@Controller('partido')
export class PartidoController {
  constructor(private readonly partidoService: PartidoService) {}

  @Post()
  create(@Body() createPartidoDto: CreatePartidoDto) {
    return this.partidoService.create(createPartidoDto);
  }

  @Get()
  findAll() {
    return this.partidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partidoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartidoDto: UpdatePartidoDto,
  ) {
    return this.partidoService.update(id, updatePartidoDto);
  }

  @Post(':id/iniciar')
  iniciar(@Param('id', ParseIntPipe) id: number) {
    return this.partidoService.iniciar(id);
  }

  @Post(':id/finalizar')
  finalizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() finalizarPartidoDto: FinalizarPartidoDto,
  ) {
    return this.partidoService.finalizar(id, finalizarPartidoDto);
  }

  @Post(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.partidoService.cancelar(id);
  }
}
