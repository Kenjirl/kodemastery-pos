export const rupiah = (number) => {
        if (!number || number === 0) return 'Rp';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number).replace(/,00$/, '');
    };
