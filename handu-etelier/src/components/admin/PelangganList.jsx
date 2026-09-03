import React from "react";

const PelangganList = ({
    data = []
}) => {

    const styles = {

        wrapper: {
            width: "100%",
            overflowX: "auto"
        },

        table: {
            width: "100%",
            minWidth: "800px",
            borderCollapse: "collapse"
        },

        th: {
            padding: "13px 15px",
            background: "#151411",
            borderBottom:
                "1px solid #312a1c",
            color: "#c8a84e",
            textAlign: "left",
            fontSize: "9px",
            fontWeight: 700,
            whiteSpace: "nowrap"
        },

        td: {
            padding: "13px 15px",
            borderBottom:
                "1px solid rgba(255,255,255,0.045)",
            color: "#d0d0d0",
            fontSize: "10px",
            verticalAlign: "middle"
        },

        number: {
            color: "#777777"
        },

        person: {
            display: "flex",
            alignItems: "center",
            gap: "9px"
        },

        avatar: {
            width: "35px",
            height: "35px",
            minWidth: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background:
                "rgba(212,175,55,0.09)",
            border:
                "1px solid rgba(212,175,55,0.20)",
            color: "#d4af37",
            fontSize: "11px",
            fontWeight: 700
        },

        name: {
            color: "#eeeeee",
            fontSize: "10px",
            fontWeight: 600
        },

        email: {
            color: "#bbbbbb"
        },

        phone: {
            color: "#bbbbbb"
        },

        address: {
            color: "#999999",
            maxWidth: "280px",
            lineHeight: 1.4
        },

        empty: {
            padding: "40px 20px",
            textAlign: "center",
            color: "#666666",
            fontSize: "10px"
        }
    };

    return (
        <div
            style={
                styles.wrapper
            }
        >

            <table
                style={
                    styles.table
                }
            >

                <thead>

                    <tr>

                        <th
                            style={
                                styles.th
                            }
                        >
                            No
                        </th>

                        <th
                            style={
                                styles.th
                            }
                        >
                            Nama
                        </th>

                        <th
                            style={
                                styles.th
                            }
                        >
                            Email
                        </th>

                        <th
                            style={
                                styles.th
                            }
                        >
                            No. WhatsApp
                        </th>

                        <th
                            style={
                                styles.th
                            }
                        >
                            Alamat
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {data.length === 0 ? (

                        <tr>

                            <td
                                colSpan="5"
                                style={
                                    styles.empty
                                }
                            >
                                Belum ada data pelanggan.
                            </td>

                        </tr>

                    ) : (

                        data.map(
                            (
                                item,
                                index
                            ) => {

                                const nama =
                                    item.nama ||
                                    "Pelanggan";

                                return (
                                    <tr
                                        key={
                                            item.id_user ||
                                            index
                                        }
                                    >

                                        <td
                                            style={
                                                styles.td
                                            }
                                        >

                                            <span
                                                style={
                                                    styles.number
                                                }
                                            >
                                                {
                                                    String(
                                                        index +
                                                        1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )
                                                }
                                            </span>

                                        </td>

                                        <td
                                            style={
                                                styles.td
                                            }
                                        >

                                            <div
                                                style={
                                                    styles.person
                                                }
                                            >

                                                <div
                                                    style={
                                                        styles.avatar
                                                    }
                                                >
                                                    {nama
                                                        .charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </div>

                                                <strong
                                                    style={
                                                        styles.name
                                                    }
                                                >
                                                    {nama}
                                                </strong>

                                            </div>

                                        </td>

                                        <td
                                            style={
                                                styles.td
                                            }
                                        >
                                            <span
                                                style={
                                                    styles.email
                                                }
                                            >
                                                {
                                                    item.email ||
                                                    "-"
                                                }
                                            </span>
                                        </td>

                                        <td
                                            style={
                                                styles.td
                                            }
                                        >
                                            <span
                                                style={
                                                    styles.phone
                                                }
                                            >
                                                {
                                                    item.no_hp ||
                                                    item.no_whatsapp ||
                                                    "-"
                                                }
                                            </span>
                                        </td>

                                        <td
                                            style={
                                                styles.td
                                            }
                                        >
                                            <span
                                                style={
                                                    styles.address
                                                }
                                            >
                                                {
                                                    item.alamat ||
                                                    "-"
                                                }
                                            </span>
                                        </td>

                                    </tr>
                                );
                            }
                        )

                    )}

                </tbody>

            </table>

        </div>
    );
};

export default PelangganList;