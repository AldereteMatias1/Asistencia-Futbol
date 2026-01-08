import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJugadores, createJugador, updateJugador, deactivateJugador } from '../features/jugadores/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useAdmin } from '../app/providers/AdminProvider';
import { handleApiError } from '../lib/handleApiError';
import { Jugador } from '../lib/types';

const schema = z.object({
  nombre: z.string().min(2, 'Ingresá un nombre válido'),
});

type FormValues = z.infer<typeof schema>;

export const JugadoresPage: React.FC = () => {
  const { isAdmin } = useAdmin();
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Jugador | null>(null);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { nombre: '' } });

  const jugadoresQuery = useQuery({ queryKey: ['jugadores'], queryFn: fetchJugadores });

  const createMutation = useMutation({
    mutationFn: createJugador,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['jugadores'] });
      form.reset();
      setOpen(false);
    },
    onError: handleApiError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { nombre: string } }) => updateJugador(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['jugadores'] });
      form.reset();
      setEditing(null);
      setOpen(false);
    },
    onError: handleApiError,
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateJugador,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['jugadores'] });
    },
    onError: handleApiError,
  });

  const jugadores = (jugadoresQuery.data ?? []).filter((jugador) =>
    jugador.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (jugador: Jugador) => {
    setEditing(jugador);
    form.reset({ nombre: jugador.nombre });
    setOpen(true);
  };

  const handleOpen = () => {
    setEditing(null);
    form.reset({ nombre: '' });
    setOpen(true);
  };

  const onSubmit = (values: FormValues) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div className="container-page space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Jugadores</h2>
          <p className="text-sm text-slate-500">Gestión de jugadores activos e históricos.</p>
        </div>
        {isAdmin && (
          <Button className="w-full md:w-auto" onClick={handleOpen}>
            Crear jugador
          </Button>
        )}
      </div>

      <Card className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Input
            label="Buscar"
            placeholder="Nombre del jugador"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="text-xs text-slate-500">{jugadores.length} resultados</div>
        </div>

        {jugadoresQuery.isError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
            No pudimos cargar los jugadores.
          </div>
        )}

        <div className="hidden md:block">
          <Table headers={['Jugador', 'Estado', 'Acciones']}>
            {jugadores.map((jugador) => (
              <tr key={jugador.id}>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{jugador.nombre}</td>
                <td className="px-4 py-3">
                  <Badge tone={jugador.activo ? 'success' : 'warning'}>
                    {jugador.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {isAdmin && (
                      <>
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(jugador)}>
                          Editar
                        </Button>
                        {jugador.activo && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deactivateMutation.mutate(jugador.id)}
                          >
                            Desactivar
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </div>

        <div className="space-y-3 md:hidden">
          {jugadores.map((jugador) => (
            <div key={jugador.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{jugador.nombre}</p>
                <Badge tone={jugador.activo ? 'success' : 'warning'}>
                  {jugador.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              {isAdmin && (
                <div className="mt-3 flex flex-col gap-2">
                  <Button variant="secondary" size="sm" className="w-full" onClick={() => handleEdit(jugador)}>
                    Editar
                  </Button>
                  {jugador.activo && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full"
                      onClick={() => deactivateMutation.mutate(jugador.id)}
                    >
                      Desactivar
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Modal
        open={open}
        title={editing ? 'Editar jugador' : 'Crear jugador'}
        onClose={() => setOpen(false)}
        footer={
          <Button
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            Guardar
          </Button>
        }
      >
        <form className="space-y-4">
          <Input label="Nombre" {...form.register('nombre')} error={form.formState.errors.nombre?.message} />
        </form>
      </Modal>
    </div>
  );
};
