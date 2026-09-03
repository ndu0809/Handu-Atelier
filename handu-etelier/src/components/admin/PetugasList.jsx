import React from "react";

import Icon from "./Icon";

const PetugasList = ({
    data = [],
    onEdit,
    onDelete
}) => {

    const styles = {

        wrapper: {
            width: "100%",
            overflowX: "auto"
        },

        table: {
            width: "100%",
            minWidth: "900px",
            borderCollapse: "collapse"
        },

        th: {
            padding: "13px 15px",
            background: "#151411",
            borderBottom:
                "1px solid #312a1c",
            color: "#c8a84e",
            fontSize: "9px",
            fontWeight: 700,
            textAlign: "left",
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
            width: "36px",
            height: "36px",
            minWidth: "36px",
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

        text: {
            color: "#bbbbbb"
        },

        role: {
            display: "inline-flex",
            alignItems: "center",
            padding:
                "5px 8px",
            borderRadius: "20px",
            background:
                "rgba(212,175,55,0.09)",
            border:
                "1px solid rgba(212,175,55,0.20)",
            color: "#d4af37",
            fontSize: "8px",
            fontWeight: 600,
            whiteSpace: "nowrap"
        },

        actions: {
            display: "flex",
            alignItems: "center",
            gap: "6px"
        },

        action: {
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "7px",
            cursor: "pointer"
        },

        edit: {
            border:
                "1px solid rgba(212,175,55,0.22)",
            background:
                "rgba(212,175,55,0.08)",
            color: "#d4af37"
        },

        delete: {
            border:
                "1px solid rgba(220,70,70,0.22)",
            background:
                "rgba(220,70,70,0.08)",
            color: "#ff7d7d"
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
                            No. WhatsApp
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
                            Role
                        </th>

                        <th
                            style={
                                styles.th
                            }
                        >
                            Aksi
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {data.length === 0 ? (

                        <tr>

                            <td
                                colSpan="6"
                                style={
                                    styles.empty
                                }
                            >
                                Belum ada data petugas.
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
                                    "Petugas";

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
                                                    styles.text
                                                }
                                            >
                                                {
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
                                                    styles.text
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
                                                    styles.role
                                                }
                                            >
                                                {
                                                    item.nama_role ||
                                                    "Petugas"
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
                                                    styles.actions
                                                }
                                            >

                                                <button
                                                    type="button"
                                                    title="Edit"
                                                    style={{
                                                        ...styles.action,
                                                        ...styles.edit
                                                    }}
                                                    onClick={() =>
                                                        onEdit &&
                                                        onEdit(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <Icon
                                                        name="edit"
                                                        size={16}
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    title="Hapus"
                                                    style={{
                                                        ...styles.action,
                                                        ...styles.delete
                                                    }}
                                                    onClick={() =>
                                                        onDelete &&
                                                        onDelete(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <Icon
                                                        name="trash"
                                                        size={16}
                                                    />
                                                </button>

                                            </div>

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

export default PetugasList;