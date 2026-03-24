export type MucDo = 'CAO' | 'TRUNG_BINH' | 'THAP';
export type TrangThai = 'MOI' | 'DANG_XU_LY' | 'CHO_DUYET' | 'DA_KET_THUC';

export interface VuViec {
  id?: string;
  tieuDe: string;
  loaiVuViecId?: number;
  loaiVuViecTen?: string;
  donViId?: string;
  mucDo: MucDo;
  trangThai: TrangThai;
  ngayXayRa?: string;
  diaDiem?: string;
  moTa?: string;
  ghiChu?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  files?: VuViecFile[];
  statusLogs?: VuViecStatusLog[];
}

export interface VuViecFile {
  id: number;
  vuViecId: string;
  tenFile: string;
  duongDan: string;
  loaiFile: string;
  kichThuoc?: number;
  isDeleted?: boolean;
  uploadedAt?: string;
}

export interface VuViecStatusLog {
  id: number;
  vuViecId: string;
  tuTrangThai?: TrangThai;
  sangTrangThai: TrangThai;
  lyDo?: string;
  changedBy?: string;
  changedAt?: string;
}

export interface CreateVuViecRequest {
  tieu_de: string;
  loai_vu_viec: string;
  muc_do: MucDo;
  don_vi_id: string;
  ngay_xay_ra: string;
  dia_diem?: string;
  mo_ta: string;
  ghi_chu?: string;
}

export interface UpdateVuViecRequest {
  tieu_de?: string;
  loai_vu_viec?: string;
  muc_do?: MucDo;
  don_vi_id?: string;
  ngay_xay_ra?: string;
  dia_diem?: string;
  mo_ta?: string;
  ghi_chu?: string;
}

export interface ChangeStatusRequest {
  sang_trang_thai: TrangThai;
  ly_do: string;
}

export interface VuViecSearchRequest {
  search?: string;
  loai?: string;
  mucDo?: MucDo;
  trangThai?: TrangThai;
  page?: number;
  limit?: number;
}

export interface DanhMucLoaiVuViec {
  id: number;
  ten: string;
  moTa?: string;
}

export interface Department {
  id: string;
  ten: string;
  maPhong?: string;
}

// Valid status transitions
export const STATUS_TRANSITIONS: Record<TrangThai, TrangThai[]> = {
  MOI: ['DANG_XU_LY'],
  DANG_XU_LY: ['CHO_DUYET'],
  CHO_DUYET: ['DA_KET_THUC', 'DANG_XU_LY'],
  DA_KET_THUC: [],
};

export const TRANG_THAI_LABELS: Record<TrangThai, string> = {
  MOI: 'Mới',
  DANG_XU_LY: 'Đang xử lý',
  CHO_DUYET: 'Chờ duyệt',
  DA_KET_THUC: 'Đã kết thúc',
};

export const MUC_DO_LABELS: Record<MucDo, string> = {
  CAO: 'Cao',
  TRUNG_BINH: 'Trung bình',
  THAP: 'Thấp',
};
