// @ts-nocheck
import React from 'react';
import { LayoutTemplate } from 'lucide-react';
import { useAppContext, type FieldConfig } from '../context/AppContext';

export const prebuiltThemes = [
  {
    name: 'Modern Corporate',
    width: 400,
    height: 600,
    bg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgNDAwIDYwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2Y4ZmFmYyIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZTJlOGYwIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iaGVhZGVyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM0ZjQ2ZTUiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzNiODJmNiIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2JnKSIgLz4KICA8cGF0aCBkPSJNMCwwIEw0MDAsMCBMNDAwLDIwMCBRMjAwLDI4MCAwLDIwMCBaIiBmaWxsPSJ1cmwoI2hlYWRlcikiIC8+CiAgPHBhdGggZD0iTTAsMCBMNDAwLDAgTDQwMCwxOTAgUTIwMCwyNjAgMCwxOTAgWiIgZmlsbD0iIzYzNjZmMSIgb3BhY2l0eT0iMC4zIiAvPgogIDxyZWN0IHg9IjAiIHk9IjU1MCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzFlMjkzYiIgLz4KPC9zdmc+',
    fields: [
      { id: 't0_c', headerKey: 'Company', x: 130, y: 30, fontSize: 24, color: '#ffffff', fontWeight: 'bold', type: 'text', isStatic: true, staticText: 'Global Corp' },
      { id: 't1_c', headerKey: 'Photo', x: 125, y: 90, fontSize: 16, color: '#000000', fontWeight: 'normal', type: 'image', width: 150, height: 150, borderRadius: 75 },
      { id: 't2_c', headerKey: 'Name', x: 110, y: 300, fontSize: 28, color: '#1e293b', fontWeight: 'bold', type: 'text' },
      { id: 't3_c', headerKey: 'Role', x: 130, y: 340, fontSize: 18, color: '#3b82f6', fontWeight: 'normal', type: 'text' },
      { id: 't4_c', headerKey: 'Department', x: 130, y: 380, fontSize: 16, color: '#64748b', fontWeight: 'normal', type: 'text' },
      { id: 't5_c', headerKey: 'ID_Label', x: 120, y: 440, fontSize: 16, color: '#94a3b8', fontWeight: 'normal', type: 'text', isStatic: true, staticText: 'ID:' },
      { id: 't6_c', headerKey: 'id_number', x: 150, y: 440, fontSize: 16, color: '#1e293b', fontWeight: 'bold', type: 'text' }
    ]
  },
  {
    name: 'Tech Conference',
    width: 400,
    height: 600,
    bg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgNDAwIDYwMCI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMwZjE3MmEiIC8+CiAgPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjIwMCIgZmlsbD0iI2E4NTVmNyIgb3BhY2l0eT0iMC4yIiBmaWx0ZXI9ImJsdXIoNDBweCkiIC8+CiAgPGNpcmNsZSBjeD0iNDAwIiBjeT0iNjAwIiByPSIyNTAiIGZpbGw9IiNlYzQ4OTkiIG9wYWNpdHk9IjAuMTUiIGZpbHRlcj0iYmx1cig1MHB4KSIgLz4KICA8cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIzNjAiIGhlaWdodD0iNTYwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzQxNTUiIHN0cm9rZS13aWR0aD0iMiIgcng9IjE2IiAvPgogIDxwYXRoIGQ9Ik0gMjAgMTgwIEwgMzgwIDE4MCIgc3Ryb2tlPSIjZWM0ODk5IiBzdHJva2Utd2lkdGg9IjQiIC8+Cjwvc3ZnPg==',
    fields: [
      { id: 't0_t', headerKey: 'Event', x: 90, y: 50, fontSize: 32, color: '#ffffff', fontWeight: 'bold', type: 'text', isStatic: true, staticText: "TechSummit '26" },
      { id: 't1_t', headerKey: 'Photo', x: 125, y: 220, fontSize: 16, color: '#000000', fontWeight: 'normal', type: 'image', width: 150, height: 150, borderRadius: 16 },
      { id: 't2_t', headerKey: 'AttendeeName', x: 90, y: 400, fontSize: 28, color: '#ffffff', fontWeight: 'bold', type: 'text' },
      { id: 't3_t', headerKey: 'Company', x: 90, y: 440, fontSize: 18, color: '#94a3b8', fontWeight: 'normal', type: 'text' },
      { id: 't4_t', headerKey: 'PassType', x: 150, y: 500, fontSize: 24, color: '#ec4899', fontWeight: 'bold', type: 'text' }
    ]
  },
  {
    name: 'Hospital Badge',
    width: 600,
    height: 400,
    bg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNjAwIDQwMCI+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmZmZmZmYiIC8+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjE1MCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMwZWE1ZTkiIC8+CiAgPHJlY3QgeD0iMTUwIiB5PSIzNTAiIHdpZHRoPSI0NTAiIGhlaWdodD0iNTAiIGZpbGw9IiNmMWY1ZjkiIC8+CiAgPHBhdGggZD0iTSAxNTAgMCBMIDI1MCAwIEwgMTUwIDQwMCBaIiBmaWxsPSIjMzhiZGY4IiBvcGFjaXR5PSIwLjIiIC8+Cjwvc3ZnPg==',
    fields: [
      { id: 't0_h', headerKey: 'Photo', x: 25, y: 25, fontSize: 16, color: '#000000', fontWeight: 'normal', type: 'image', width: 100, height: 130, borderRadius: 8 },
      { id: 't1_h', headerKey: 'Name', x: 180, y: 80, fontSize: 36, color: '#0f172a', fontWeight: 'bold', type: 'text' },
      { id: 't2_h', headerKey: 'Title', x: 180, y: 130, fontSize: 20, color: '#0ea5e9', fontWeight: 'bold', type: 'text' },
      { id: 't3_h', headerKey: 'Department', x: 180, y: 170, fontSize: 18, color: '#64748b', fontWeight: 'normal', type: 'text' },
      { id: 't4_h', headerKey: 'ID_Label', x: 180, y: 240, fontSize: 16, color: '#94a3b8', fontWeight: 'normal', type: 'text', isStatic: true, staticText: 'ID:' },
      { id: 't5_h', headerKey: 'id_number', x: 220, y: 240, fontSize: 18, color: '#0f172a', fontWeight: 'bold', type: 'text' },
      { id: 't6_h', headerKey: 'StaffType', x: 25, y: 320, fontSize: 24, color: '#ffffff', fontWeight: 'bold', type: 'text', isStatic: true, staticText: 'STAFF' },
      { id: 't7_h', headerKey: 'Hospital', x: 450, y: 365, fontSize: 14, color: '#64748b', fontWeight: 'normal', type: 'text', isStatic: true, staticText: 'CITY HOSPITAL' }
    ]
  },
  {
    name: 'University Student',
    width: 400,
    height: 600,
    bg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgNDAwIDYwMCI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNmZmZmZmYiIC8+CiAgPCEtLSBTZWFsIC8gV2F0ZXJtYXJrIC0tPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjMwMCIgcj0iMTAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZWNhY2EiIHN0cm9rZS13aWR0aD0iNCIgb3BhY2l0eT0iMC40IiAvPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjMwMCIgcj0iODUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZlY2FjYSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtZGFzaGFycmF5PSI0IDQiIG9wYWNpdHk9IjAuNCIgLz4KICA8cGF0aCBkPSJNMTcwLDI4MCBMMjAwLDI1MCBMMjMwLDI4MCBMMjAwLDM1MCBaIiBmaWxsPSIjZmVjYWNhIiBvcGFjaXR5PSIwLjMiIC8+CiAgPCEtLSBIZWFkZXIgLS0+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM5OTFiMWIiIC8+CiAgPHJlY3QgeD0iMCIgeT0iMTAwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjU5ZTBiIiAvPgogIDwhLS0gRm9vdGVyIEJhcmNvZGUgLS0+CiAgPHJlY3QgeD0iMCIgeT0iNTIwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjhmYWZjIiAvPgogIDwhLS0gRmFrZSBCYXJjb2RlIExpbmVzIC0tPgogIDxnIGZpbGw9IiMwMDAwMDAiPgogICAgPHJlY3QgeD0iMTAwIiB5PSI1NDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjQwIiAvPgogICAgPHJlY3QgeD0iMTA4IiB5PSI1NDAiIHdpZHRoPSI4IiBoZWlnaHQ9IjQwIiAvPgogICAgPHJlY3QgeD0iMTIwIiB5PSI1NDAiIHdpZHRoPSIyIiBoZWlnaHQ9IjQwIiAvPgogICAgPHJlY3QgeD0iMTI2IiB5PSI1NDAiIHdpZHRoPSIxMCIgaGVpZ2h0PSI0MCIgLz4KICAgIDxyZWN0IHg9IjE0MCIgeT0iNTQwIiB3aWR0aD0iNiIgaGVpZ2h0PSI0MCIgLz4KICAgIDxyZWN0IHg9IjE1MCIgeT0iNTQwIiB3aWR0aD0iMiIgaGVpZ2h0PSI0MCIgLz4KICAgIDxyZWN0IHg9IjE1NiIgeT0iNTQwIiB3aWR0aD0iMTIiIGhlaWdodD0iNDAiIC8+CiAgICA8cmVjdCB4PSIxNzIiIHk9IjU0MCIgd2lkdGg9IjQiIGhlaWdodD0iNDAiIC8+CiAgICA8cmVjdCB4PSIxODAiIHk9IjU0MCIgd2lkdGg9IjgiIGhlaWdodD0iNDAiIC8+CiAgICA8cmVjdCB4PSIxOTIiIHk9IjU0MCIgd2lkdGg9IjIiIGhlaWdodD0iNDAiIC8+CiAgICA8cmVjdCB4PSIxOTgiIHk9IjU0MCIgd2lkdGg9IjE0IiBoZWlnaHQ9IjQwIiAvPgogICAgPHJlY3QgeD0iMjE2IiB5PSI1NDAiIHdpZHRoPSI2IiBoZWlnaHQ9IjQwIiAvPgogICAgPHJlY3QgeD0iMjI2IiB5PSI1NDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjQwIiAvPgogICAgPHJlY3QgeD0iMjM0IiB5PSI1NDAiIHdpZHRoPSIxMCIgaGVpZ2h0PSI0MCIgLz4KICAgIDxyZWN0IHg9IjI0OCIgeT0iNTQwIiB3aWR0aD0iMiIgaGVpZ2h0PSI0MCIgLz4KICAgIDxyZWN0IHg9IjI1NCIgeT0iNTQwIiB3aWR0aD0iOCIgaGVpZ2h0PSI0MCIgLz4KICAgIDxyZWN0IHg9IjI2NiIgeT0iNTQwIiB3aWR0aD0iMTIiIGhlaWdodD0iNDAiIC8+CiAgICA8cmVjdCB4PSIyODIiIHk9IjU0MCIgd2lkdGg9IjQiIGhlaWdodD0iNDAiIC8+CiAgICA8cmVjdCB4PSIyOTAiIHk9IjU0MCIgd2lkdGg9IjgiIGhlaWdodD0iNDAiIC8+CiAgPC9nPgo8L3N2Zz4=',
    fields: [
      { id: 'u0', headerKey: 'University', x: 80, y: 35, fontSize: 24, color: '#ffffff', fontWeight: 'bold', type: 'text', isStatic: true, staticText: 'STATE UNIVERSITY' },
      { id: 'u1', headerKey: 'CardType', x: 130, y: 70, fontSize: 16, color: '#fef08a', fontWeight: 'bold', type: 'text', isStatic: true, staticText: 'STUDENT ID CARD' },
      { id: 'u2', headerKey: 'Photo', x: 40, y: 150, fontSize: 16, color: '#000000', fontWeight: 'normal', type: 'image', width: 120, height: 150, borderRadius: 8 },
      { id: 'u3', headerKey: 'StudentName', x: 180, y: 160, fontSize: 24, color: '#1e293b', fontWeight: 'bold', type: 'text' },
      { id: 'u4', headerKey: 'Major', x: 180, y: 200, fontSize: 16, color: '#991b1b', fontWeight: 'bold', type: 'text' },
      { id: 'u5', headerKey: 'ValidLabel', x: 180, y: 240, fontSize: 12, color: '#64748b', fontWeight: 'normal', type: 'text', isStatic: true, staticText: 'Valid Thru:' },
      { id: 'u6', headerKey: 'ValidThru', x: 180, y: 260, fontSize: 16, color: '#0f172a', fontWeight: 'bold', type: 'text' },
      { id: 'u7', headerKey: 'ID_Label', x: 180, y: 310, fontSize: 12, color: '#64748b', fontWeight: 'normal', type: 'text', isStatic: true, staticText: 'Student ID:' },
      { id: 'u8', headerKey: 'id_number', x: 180, y: 330, fontSize: 18, color: '#0f172a', fontWeight: 'bold', type: 'text' }
    ]
  },
  {
    name: 'VIP Backstage Pass',
    width: 400,
    height: 600,
    bg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgNDAwIDYwMCI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMxODE4MWIiIC8+CiAgPCEtLSBEaWFnb25hbCBzdHJpcGVzIC0tPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9InN0cmlwZXMiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2VhYjMwOCIgLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPCEtLSBUb3AgYW5nbGUgYmxvY2sgLS0+CiAgPHBhdGggZD0iTTAsMCBMNDAwLDAgTDQwMCwxMDAgTDAsMTUwIFoiIGZpbGw9InVybCgjc3RyaXBlcykiIC8+CiAgPHBhdGggZD0iTTAsMCBMNDAwLDAgTDQwMCw5MCBMMCwxNDAgWiIgZmlsbD0iIzAwMDAwMCIgLz4KICA8IS0tIEJvdHRvbSBibG9jayAtLT4KICA8cmVjdCB4PSIwIiB5PSI0ODAiIHdpZHRoPSI0MDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjZWFiMzA4IiAvPgo8L3N2Zz4=',
    fields: [
      { id: 'v0', headerKey: 'FestLabel', x: 20, y: 30, fontSize: 36, color: '#ffffff', fontWeight: '900', type: 'text', isStatic: true, staticText: 'SUMMER FEST' },
      { id: 'v1', headerKey: 'Year', x: 300, y: 35, fontSize: 24, color: '#eab308', fontWeight: 'bold', type: 'text', isStatic: true, staticText: '2026' },
      { id: 'v2', headerKey: 'Photo', x: 100, y: 180, fontSize: 16, color: '#000000', fontWeight: 'normal', type: 'image', width: 200, height: 200, borderRadius: 0 },
      { id: 'v3', headerKey: 'Name', x: 100, y: 400, fontSize: 32, color: '#ffffff', fontWeight: 'bold', type: 'text' },
      { id: 'v4', headerKey: 'Role', x: 100, y: 440, fontSize: 20, color: '#a1a1aa', fontWeight: 'bold', type: 'text' },
      { id: 'v5', headerKey: 'AccessType', x: 100, y: 520, fontSize: 36, color: '#000000', fontWeight: '900', type: 'text', isStatic: true, staticText: 'ALL ACCESS' },
      { id: 'v6', headerKey: 'id_number', x: 100, y: 570, fontSize: 14, color: '#a1a1aa', fontWeight: 'bold', type: 'text' }
    ]
  },
  {
    name: 'Press / Media',
    width: 400,
    height: 600,
    bg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgNDAwIDYwMCI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNmZmZmZmYiIC8+CiAgPCEtLSBIZWF2eSBib3JkZXIgLS0+CiAgPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMzgwIiBoZWlnaHQ9IjU4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjgiIC8+CiAgPCEtLSBQUkVTUyBIZWFkZXIgQmxvY2sgLS0+CiAgPHJlY3QgeD0iMTQiIHk9IjE0IiB3aWR0aD0iMzcyIiBoZWlnaHQ9IjEyMCIgZmlsbD0iIzAwMDAwMCIgLz4KICA8IS0tIFJlZCBBY2NlbnQgLS0+CiAgPHJlY3QgeD0iMTQiIHk9IjEzNCIgd2lkdGg9IjM3MiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2RjMjYyNiIgLz4KICA8cmVjdCB4PSIxNCIgeT0iNTAwIiB3aWR0aD0iMzcyIiBoZWlnaHQ9IjE2IiBmaWxsPSIjZGMyNjI2IiAvPgo8L3N2Zz4=',
    fields: [
      { id: 'p0', headerKey: 'PressLabel', x: 120, y: 50, fontSize: 48, color: '#ffffff', fontWeight: '900', type: 'text', isStatic: true, staticText: 'PRESS' },
      { id: 'p1', headerKey: 'Photo', x: 125, y: 170, fontSize: 16, color: '#000000', fontWeight: 'normal', type: 'image', width: 150, height: 180, borderRadius: 0 },
      { id: 'p2', headerKey: 'Name', x: 125, y: 380, fontSize: 28, color: '#000000', fontWeight: 'bold', type: 'text' },
      { id: 'p3', headerKey: 'Organization', x: 125, y: 420, fontSize: 20, color: '#dc2626', fontWeight: 'bold', type: 'text' },
      { id: 'p4', headerKey: 'ValidLabel', x: 125, y: 460, fontSize: 14, color: '#6b7280', fontWeight: 'normal', type: 'text', isStatic: true, staticText: 'VALID THROUGH' },
      { id: 'p5', headerKey: 'Year', x: 260, y: 460, fontSize: 14, color: '#000000', fontWeight: 'bold', type: 'text', isStatic: true, staticText: '2026' },
      { id: 'p6', headerKey: 'id_number', x: 160, y: 535, fontSize: 24, color: '#000000', fontWeight: '900', type: 'text' }
    ]
  }
];

const ThemeSelector: React.FC = () => {
  const { setTemplateImage, setFields, setHeaders, headers } = useAppContext();

  const applyTheme = (theme: typeof prebuiltThemes[0]) => {
    setTemplateImage(theme.bg);
    setFields(theme.fields as FieldConfig[]);
    
    // Automatically add these to headers if not present, so manual entry works
    const newHeaders = new Set(headers);
    theme.fields.forEach(f => newHeaders.add(f.headerKey));
    setHeaders(Array.from(newHeaders));
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
      <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
        <LayoutTemplate className="w-5 h-5 text-indigo-500" />
        Quick Start: Prebuilt Themes
      </h2>
      
      <div className="grid grid-cols-3 gap-4">
        {prebuiltThemes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => applyTheme(theme)}
            className="flex flex-col items-center gap-2 p-2 rounded-xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
          >
            <div className="w-full h-24 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
              <img src={theme.bg} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <span className="text-xs font-semibold text-gray-700">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
