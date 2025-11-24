import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, User, Mail, Phone, Pencil, Trash2 } from "lucide-react";

import OperatorForm from "../components/operators/OperatorForm";

export default function Operators() {
  const [showForm, setShowForm] = useState(false);
  const [editingOperator, setEditingOperator] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const queryClient = useQueryClient();

  const { data: operators = [], isLoading } = useQuery({
    queryKey: ['operators'],
    queryFn: () => base44.entities.Operator.list('-created_date'),
  });

  const createOperatorMutation = useMutation({
    mutationFn: (data) => base44.entities.Operator.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['operators']);
      setShowForm(false);
      setEditingOperator(null);
    },
  });

  const updateOperatorMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Operator.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['operators']);
      setShowForm(false);
      setEditingOperator(null);
    },
  });

  const deleteOperatorMutation = useMutation({
    mutationFn: (id) => base44.entities.Operator.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['operators']);
    },
  });

  const handleSubmit = (data) => {
    if (editingOperator) {
      updateOperatorMutation.mutate({ id: editingOperator.id, data });
    } else {
      createOperatorMutation.mutate(data);
    }
  };

  const handleEdit = (operator) => {
    setEditingOperator(operator);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this driver?')) {
      deleteOperatorMutation.mutate(id);
    }
  };

  const filteredOperators = operators.filter(op => {
    const matchesSearch = op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || op.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || op.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'border-green-500/50 bg-green-500/10 text-green-400';
      case 'on_break': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400';
      case 'off_duty': return 'border-zinc-600/50 bg-zinc-800/50 text-zinc-400';
      case 'on_leave': return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
      default: return 'border-zinc-700 bg-zinc-900 text-zinc-400';
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      long_haul_driver: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      regional_driver: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      local_driver: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      team_driver: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      owner_operator: 'bg-green-500/10 text-green-400 border-green-500/30',
      dispatcher: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    };
    return colors[role] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
                DRIVER MANAGEMENT
              </h1>
            </div>
            <p className="text-zinc-500 text-sm uppercase tracking-wider mono">DRIVER REGISTRY</p>
          </div>
          <Button 
            onClick={() => {
              setEditingOperator(null);
              setShowForm(!showForm);
            }}
            className="bg-cyan-600 hover:bg-cyan-700 uppercase tracking-wider text-xs font-bold mono"
          >
            <Plus className="w-4 h-4 mr-2" />
            ADD DRIVER
          </Button>
        </div>

        {showForm && (
          <OperatorForm
            operator={editingOperator}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingOperator(null);
            }}
            isSubmitting={createOperatorMutation.isPending || updateOperatorMutation.isPending}
          />
        )}

        <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
          <CardHeader className="border-b border-zinc-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <Input
                  placeholder="Search by name or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black border-zinc-800 text-white placeholder:text-zinc-600"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white text-sm mono"
                >
                  <option value="all">All Divisions</option>
                  <option value="long_haul">Long Haul</option>
                  <option value="regional">Regional</option>
                  <option value="local_delivery">Local Delivery</option>
                  <option value="refrigerated">Refrigerated</option>
                  <option value="hazmat">HazMat</option>
                  <option value="flatbed">Flatbed</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white text-sm mono"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="on_break">On Break</option>
                  <option value="off_duty">Off Duty</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-12 text-zinc-500">Loading operators...</div>
            ) : filteredOperators.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 uppercase tracking-wider text-sm mono">NO DRIVERS FOUND</p>
                <p className="text-xs text-zinc-600 mt-1 uppercase tracking-wider mono">Add drivers to start tracking</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOperators.map((operator) => (
                  <Card 
                    key={operator.id} 
                    className="border-2 border-zinc-800 bg-black hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center relative">
                            <User className="w-6 h-6 text-white" />
                            <div className="absolute inset-0 bg-cyan-400 rounded blur-sm opacity-20" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-base text-white uppercase tracking-wide truncate">{operator.name}</h4>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mono">ID: {operator.employee_id}</p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(operator.status)} border uppercase text-[10px] font-bold tracking-wider mono`}>
                          {operator.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-zinc-950 border border-zinc-800 rounded">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mono mb-1">ROLE</p>
                          <Badge className={`${getRoleColor(operator.role)} border text-[10px] font-bold mono`}>
                            {operator.role.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <div className="p-2 bg-zinc-950 border border-zinc-800 rounded">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mono mb-1">DIVISION</p>
                          <p className="text-xs font-semibold text-white uppercase">{operator.department.replace('_', ' ')}</p>
                        </div>
                      </div>

                      <div className="p-2 bg-zinc-950 border border-zinc-800 rounded">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mono mb-1">CERTIFICATION</p>
                        <p className="text-xs font-semibold text-cyan-400 uppercase">{operator.certification_level}</p>
                      </div>

                      {(operator.contact_email || operator.contact_phone) && (
                        <div className="pt-2 border-t border-zinc-800 space-y-2">
                          {operator.contact_email && (
                            <div className="flex items-center gap-2 text-xs">
                              <Mail className="w-3 h-3 text-zinc-500" />
                              <span className="text-zinc-400 truncate mono">{operator.contact_email}</span>
                            </div>
                          )}
                          {operator.contact_phone && (
                            <div className="flex items-center gap-2 text-xs">
                              <Phone className="w-3 h-3 text-zinc-500" />
                              <span className="text-zinc-400 mono">{operator.contact_phone}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(operator)}
                          className="border-zinc-700 hover:bg-zinc-800 hover:text-cyan-400 text-xs"
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          EDIT
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(operator.id)}
                          className="border-zinc-700 hover:bg-red-950 hover:text-red-400 hover:border-red-500/30 text-xs"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          REMOVE
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}