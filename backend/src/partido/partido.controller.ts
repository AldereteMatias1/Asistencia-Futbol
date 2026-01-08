import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { FinalizarPartidoDto } from './dto/finalizar-partido.dto';
import { PartidoResponseDto } from './dto/partido-response.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { PartidoService } from './partido.service';

@ApiTags('Partidos')
@Controller('partido')
export class PartidoController {
  constructor(private readonly partidoService: PartidoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear partido' })
  @ApiCreatedResponse({ description: 'Partido creado.', type: PartidoResponseDto })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  create(@Body() createPartidoDto: CreatePartidoDto) {
    return this.partidoService.create(createPartidoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar partidos' })
  @ApiOkResponse({ description: 'Listado de partidos.', type: [PartidoResponseDto] })
  findAll() {
    return this.partidoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener partido por id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Partido encontrado.', type: PartidoResponseDto })
  @ApiNotFoundResponse({ description: 'Partido no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partidoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar partido' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Partido actualizado.', type: PartidoResponseDto })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  @ApiNotFoundResponse({ description: 'Partido no encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartidoDto: UpdatePartidoDto,
  ) {
    return this.partidoService.update(id, updatePartidoDto);
  }

  @Post(':id/iniciar')
  @ApiOperation({ summary: 'Iniciar partido' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Partido iniciado.', type: PartidoResponseDto })
  @ApiBadRequestResponse({ description: 'No se puede iniciar el partido.' })
  @ApiNotFoundResponse({ description: 'Partido no encontrado.' })
  iniciar(@Param('id', ParseIntPipe) id: number) {
    return this.partidoService.iniciar(id);
  }

  @Post(':id/finalizar')
  @ApiOperation({ summary: 'Finalizar partido' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Partido finalizado.', type: PartidoResponseDto })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  @ApiNotFoundResponse({ description: 'Partido no encontrado.' })
  finalizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() finalizarPartidoDto: FinalizarPartidoDto,
  ) {
    return this.partidoService.finalizar(id, finalizarPartidoDto);
  }

  @Post(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar partido' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Partido cancelado.', type: PartidoResponseDto })
  @ApiBadRequestResponse({ description: 'No se puede cancelar el partido.' })
  @ApiNotFoundResponse({ description: 'Partido no encontrado.' })
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.partidoService.cancelar(id);
  }
}
