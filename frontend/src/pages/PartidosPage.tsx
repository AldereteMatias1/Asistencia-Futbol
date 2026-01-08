import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPartido, fetchPartidos } from '../features/partidos/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAdmin } from '../app/providers/AdminProvider';
import { handleApiError } from '../lib/handleApiError';
import { formatDateTime } from '../lib/utils';

const schema = z.object({
  fecha: z.string().min(1, 'Seleccioná fecha y hora'),
  cancha: z.string().min(2, 'Ingresá la cancha'),
  equipoA: z.string().min(2, 'Ingresá equipo A'),
  equipoB: z.string().min(2, 'Ingresá equipo B'),
});

type FormValues = z.infer<typeof schema>;

const estados = ['PROGRAMADO', 'EN_JUEGO', 'FINALIZADO', 'CANCELADO'];

export const PartidosPage: React.FC = () => {
  const { isAdmin } = useAdmin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [estado, setEstado] = React.useState('');
  const [desde, setDesde] = React.useState('');
  const [hasta, setHasta] = React.useState('');

  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const partidosQuery = useQuery({
    queryKey: ['partidos', estado, desde, hasta],
    queryFn: () => fetchPartidos({ estado, desde, hasta }),
  });

  const createMutation = useMutation({
    mutationFn: createPartido,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['partidos'] });
      setOpen(false);
      form.reset();
      navigate(`/partidos/${data.id}`);
    },
    onError: handleApiError,
  });

  const onSubmit = (values: FormValues) => createMutation.mutate(values);

  return (
    <div className="container-page space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Partidos</h2>
          <p className="text-sm text-slate-500">Organizá el flujo completo de un partido.</p>
        </div>
        {isAdmin && (
          <Button className="w-full md:w-auto" onClick={() => setOpen(true)}>
            Crear partido
          </Button>
        )}
      </div>

      <Card className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Guía rápida: cómo se usa</h3>
        <div className="grid gap-3 md:grid-cols-5">
          {[
            '1. Crear partido',
            '2. Seleccionar jugadores',
            '3. Iniciar partido',
            '4. Gestionar participaciones',
            '5. Finalizar y ver resumen',
          ].map((step, index) => (
            <div key={step} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-500">Paso {index + 1}</p>
              <p className="text-sm font-semibold text-slate-900">{step}</p>
            </div>
          ))}
        </div>
        {isAdmin && (
          <Button className="w-full md:w-auto" onClick={() => setOpen(true)}>
            Crear partido ahora
          </Button>
        )}
      </Card>

      <Card className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="text-sm text-slate-600">
            Estado
            <select
              value={estado}
              onChange={(event) => setEstado(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              {estados.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <Input label="Desde" type="date" value={desde} onChange={(event) => setDesde(event.target.value)} />
          <Input label="Hasta" type="date" value={hasta} onChange={(event) => setHasta(event.target.value)} />
          <Button
            variant="secondary"
            className="mt-6 w-full"
            onClick={() => {
              setEstado('');
              setDesde('');
              setHasta('');
            }}
          >
            Limpiar
          </Button>
        </div>

        {partidosQuery.isError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
            No pudimos cargar los partidos.
          </div>
        )}

        <div className="space-y-3">
          {(partidosQuery.data ?? []).map((partido) => (
            <div key={partido.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {partido.equipoA} vs {partido.equipoB}
                  </p>
                  <p className="text-xs text-slate-500">{formatDateTime(partido.fecha)} · {partido.cancha}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={partido.estado === 'EN_JUEGO' ? 'info' : partido.estado === 'FINALIZADO' ? 'success' : 'warning'}>
                    {partido.estado}
                  </Badge>
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/partidos/${partido.id}`)}>
                    Ver detalle
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {partidosQuery.data?.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Aún no hay partidos con estos filtros.
            </div>
          )}
        </div>
      </Card>

      <Modal
        open={open}
        title="Crear partido"
        onClose={() => setOpen(false)}
        footer={
          <Button
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
            disabled={createMutation.isPending}
          >
            Crear y continuar
          </Button>
        }
      >
        <form className="space-y-4">
          <Input label="Fecha y hora" type="datetime-local" {...form.register('fecha')} error={form.formState.errors.fecha?.message} />
          <Input label="Cancha" {...form.register('cancha')} error={form.formState.errors.cancha?.message} />
          <Input label="Equipo A" {...form.register('equipoA')} error={form.formState.errors.equipoA?.message} />
          <Input label="Equipo B" {...form.register('equipoB')} error={form.formState.errors.equipoB?.message} />
        </form>
      </Modal>
    </div>
  );
};
