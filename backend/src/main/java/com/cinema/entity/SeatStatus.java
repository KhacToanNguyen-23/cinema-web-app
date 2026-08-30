package com.cinema.entity;

/**
 * [AI UPDATE - Enum dinh danh 4 trang thai chuan cua ghe theo tung suat chieu]
 */
public enum SeatStatus {
    AVAILABLE,   // 1. Ghe con trong, khach hang co the chon
    HOLDING,     // 2. Ghe dang duoc giu tam thoi trong 5 phut
    BOOKED,      // 3. Ghe da thanh toan thanh cong (da ban vinh vien)
    MAINTENANCE  // 4. Ghe bi bao tri hoac hong hoc vat ly
}