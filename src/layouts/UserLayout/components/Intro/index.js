import React from 'react';

const LoginIntro = () => {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.title}>KUIPMAKE</div>
                <p style={styles.description}>API管理平台</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    content: {
        width: '350px',
        color: '#fff',
    },
    title: {
        marginBottom: '20px',
        fontWeight: '700',
        fontSize: '38px',
        lineHeight: '1.5',
    },
    description: {
        margin: '0',
        fontSize: '24px',
        color: '#fff',
        letterSpacing: '0.45px',
        lineHeight: '32px',
    },
};

export default LoginIntro;
