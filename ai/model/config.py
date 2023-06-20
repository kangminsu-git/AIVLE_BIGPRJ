class args:
    dataset = 'ai/model/dataset'
    hidden_dim = 600
    latent_dim = 200
    batch_size = 500
    beta = None
    gamma = 0.005
    lr = 5e-4
    n_epochs = 10
    n_enc_epochs = 3
    n_dec_epochs = 1
    not_alternating = False
    seed = 2023
    early_stopping = 5
    total_anneal_steps = 200000
    anneal_cap = 0.2
    log_dir = 'ai/model/logs'
    save_dir = 'ai/model/models'
    wd = 0.00
    log_interval = 100
    save = 'model.pth'