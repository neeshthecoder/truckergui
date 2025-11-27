import React from "react";
import { Card, CardContent, CardHeader } from "../../Components/ui/card";
import { Badge } from "../../Components/ui/badge";
import { Button } from "../../Components/ui/button";
import { Pencil, Trash2, Mail, Phone, User } from "lucide-react";

export default function OperatorCard({ operator, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'on_break': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'off_duty': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'on_leave': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{operator.name}</h3>
              <p className="text-sm text-slate-600">ID: {operator.employee_id}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(operator.status)} border`}>
            {operator.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-slate-600">Role</p>
            <p className="font-medium capitalize">{operator.role}</p>
          </div>
          <div>
            <p className="text-slate-600">Department</p>
            <p className="font-medium capitalize">{operator.department}</p>
          </div>
          <div>
            <p className="text-slate-600">Certification</p>
            <p className="font-medium capitalize">{operator.certification_level}</p>
          </div>
        </div>

        {(operator.contact_email || operator.contact_phone) && (
          <div className="pt-3 border-t space-y-2">
            {operator.contact_email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 truncate">{operator.contact_email}</span>
              </div>
            )}
            {operator.contact_phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{operator.contact_phone}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(operator)}
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(operator.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}